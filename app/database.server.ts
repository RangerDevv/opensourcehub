import { Session } from "@remix-run/node";
import { db } from "./firebase.server";
import {
  getClaimsFromSession,
  getGitHubUserDataFromClaims,
} from "./session.server";
import { User, UserProfile } from "./types";

// The names of collections in Firestore. Don't change these unless you're
// absolutely sure of what you're doing!
const USER_PROFILES_COLLECTION = "profiles";
const USERS_COLLECTION = "users";

const GITHUB_PROFILE_PREFIX = "github_";

function getProfileKeyForUser(user: User) {
  return GITHUB_PROFILE_PREFIX + user.githubLogin;
}

function getProfileKeyForSlug(slug: string) {
  return GITHUB_PROFILE_PREFIX + slug;
}

/**
 * Create a new user in Firestore and return it. This makes a call to the GitHub
 * API with the user's access token to access and store their `login`.
 */
export async function createUser(session: Session) {
  // We need to make an API call to GitHub to get the user's login
  const claims = await getClaimsFromSession(session);

  if (!claims) {
    throw new Error("Unable to decode claims before creating user");
  }

  const githubUserData = await getGitHubUserDataFromClaims(
    session.get("accessToken"),
    claims
  );

  const uid = claims.uid;

  const user: User = {
    uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    githubLogin: githubUserData.login,
    displayName: claims.name,
    pictureUrl: claims.picture || githubUserData.picture,
    email: claims.email || githubUserData.email,
  };

  // The create() method fails if the user already exists
  await db.collection(USERS_COLLECTION).doc(uid).create(user);

  return user;
}

/**
 * Fetch a user in our database by their unique `uid`
 */
export async function getUserByUid(uid: string) {
  const user = await db.collection(USERS_COLLECTION).doc(uid).get();

  try {
    return user.data() as User;
  } catch (_) {
    return null;
  }
}

/**
 * Creates a profile for a specific user and then returns it. If there's already
 * a profile, this will fail.
 */
export async function createProfileForUser(user: User) {
  const profile: UserProfile = {
    displayName: user.displayName,
    userId: user.uid,
    githubUrl: `https://github.com/${user.githubLogin}`,
    pictureUrl: user.pictureUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    await db
      .collection(USER_PROFILES_COLLECTION)
      .doc(getProfileKeyForUser(user))
      .create(profile);

    return profile;
  } catch (_) {
    return null;
  }
}

type UpdateUserProfilePayload = Partial<UserProfile>;

export async function updateProfileForUser(
  user: User,
  updatedProfile: UpdateUserProfilePayload
) {
  const profileKey = getProfileKeyForUser(user);

  // Delete the fields we don't want to alter
  delete updatedProfile.createdAt;
  delete updatedProfile.updatedAt;
  delete updatedProfile.userId;
  delete updatedProfile.githubUrl;

  // Send the correct time stamp
  updatedProfile.updatedAt = new Date().toISOString();

  await db
    .collection(USER_PROFILES_COLLECTION)
    .doc(profileKey)
    .set(updatedProfile, { merge: true });
}

export async function getUserProfileBySlug(
  slug: string
): Promise<UserProfile | null> {
  const profileOrNull = await db
    .collection(USER_PROFILES_COLLECTION)
    .doc(getProfileKeyForSlug(slug))
    .get();

  try {
    return profileOrNull.data() as UserProfile;
  } catch (_) {
    return null;
  }
}
