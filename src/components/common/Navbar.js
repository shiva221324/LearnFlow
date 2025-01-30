import React from "react";
import CTAButton from "../core/Homepage/Button";
import { NavbarLinks } from "../../data/navbar-links";
import { Link, matchPath } from "react-router-dom";
import { useLocation } from "react-router-dom";
const Navbar = () => {
  const location = useLocation();
  function matchRoute(route) {
    // if route is matched with (current route) then return true and color of text turn yellow otherwise white;
    return matchPath({ path: route }, location.pathname);
  }
  return (
    <div className=" text-white  h-20 flex items-center justify-center border-b-[0.6px] border-b-white">
      <div className=" flex w-[11/12] max-w-maxContent items-center gap-10 ">
        <Link to="/">
          <div
            className=" text-[2rem] text-white font-bold "
            style={{
              fontFamily: "Playfair ",
            }}
          >
            LearnFlow
          </div>
        </Link>
        <nav>
          <ul className=" flex gap-x-6 ">
            {NavbarLinks.map((link, index) => {
              return (
                <li key={index}>
                  {link.title === "Catalog" ? (
                    <div></div>
                  ) : (
                    <Link to={link?.path}>
                      <p
                        className={`${
                          matchRoute(link?.path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        {link.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className=" flex gap-x-4"></div>
      </div>
    </div>
  );
};

export default Navbar;
