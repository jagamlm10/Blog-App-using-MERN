import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../images/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useAuth } from "../context/userContext";

const Header = () => {
  const [isNavShowing, setIsNavShowing] = useState(
    window.innerWidth > 800 ? true : false
  );
  const { currentUser } = useAuth();
  const closeHandler = () => {
    if (window.innerWidth < 800) {
      setIsNavShowing(false);
    } else {
      setIsNavShowing(true);
    }
  };
  useEffect(() => {
    closeHandler();
  }, []);

  return (
    <nav>
      <div className="container nav__container">
        <Link to={"/"} className="nav__logo" onClick={closeHandler}>
          <img src={Logo} alt="NavBar Logo" />
        </Link>
        {currentUser?.id && isNavShowing && (
          <ul className="nav__menu">
            <li>
              <Link to={`/profile/${currentUser.id}`} onClick={closeHandler}>
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to={"/create"} onClick={closeHandler}>
                Create Post
              </Link>
            </li>
            <li>
              <Link to={"/authors"} onClick={closeHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to={"/logout"} onClick={closeHandler}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?.id && isNavShowing && (
          <ul className="nav__menu">
            <li>
              <Link to={"/authors"} onClick={closeHandler}>
                Authors
              </Link>
            </li>
            <li>
              <Link to={"/login"} onClick={closeHandler}>
                Login
              </Link>
            </li>
          </ul>
        )}
        <button
          className="nav__toggle-btn"
          onClick={() => setIsNavShowing(!isNavShowing)}
        >
          {isNavShowing ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
