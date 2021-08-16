import React from "react";
import Link from "next/link";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">
          <a className="navbar-brand">
            <img
              id="123"
              src="images/wallet2.svg"
              alt="wallet"
              className="d-inline-block align-text-center me-3"
            />
            Ticketing
          </a>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link href="/auth/signup">
                <a className="nav-link">SignUp</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/auth/signin">
                <a className="nav-link">SignIn</a>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
