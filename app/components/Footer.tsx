import type { FC } from "react";
import { Link } from "@remix-run/react";
import {
  HOW_TO_LIST_PROJECT_LINK,
  DISCORD_LINK,
  RESOURCES_LINK,
  ABOUT_LINK,
} from "~/utils/constants";
import CodeSeeWordmark from "~/images/CodeSeeWordmark";
import logo from "~/images/logo.png";
import { buttonStyle } from "~/utils/linkStyle";

const Footer: FC = () => (
  <footer className="bg-gradient text-black-400 px-4 py-10">
    <Link to="/" className="block">
      <img src={logo} alt="" className="my-2 mx-auto" style={{ height: 35 }} />
    </Link>
    <div className="flex items-center justify-center text-center px-2 mt-7">
      <a
        href={HOW_TO_LIST_PROJECT_LINK}
        rel="noopener noreferrer"
        target="_blank"
        className={buttonStyle("primary")}
      >
        List Your Project
      </a>
    </div>
    <div className="text-sm text-white text-center font-semibold flex gap-6 justify-center mt-5 mb-12">
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={"/"}
        target="_blank"
        rel="noreferrer"
      >
        Projects
      </a>
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={ABOUT_LINK}
        target="_blank"
        rel="noreferrer"
      >
        About
      </a>
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={RESOURCES_LINK}
        target="_blank"
        rel="noreferrer"
      >
        Resources
      </a>
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={DISCORD_LINK}
        target="_blank"
        rel="noreferrer"
      >
        Join Us
      </a>
    </div>
    <p className="text-sm text-center text-white flex items-center justify-center">
      Built with tea and love by
      <a
        className="opacity-100 supports-hover:hover:opacity-75 ml-1"
        href="https://www.codesee.io"
        target="_blank"
        rel="noreferrer"
        aria-label="CodeSee"
      >
        <CodeSeeWordmark width="100" className="h-4" />
      </a>
    </p>
  </footer>
);

export default Footer;
