import React from "react";
import Link from "next/link";
import Image from "next/image";

function Header({ currentUser }) {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/">
          <a className="navbar-brand">
            <Image
              src="/images/wallet2.svg"
              alt="wallet"
              height="22"
              width="22"
            />
            <span className="ms-3">Ticketing</span>
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
          {!currentUser ? (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/auth/signup">
                  <a className="nav-link">Sign Up</a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/auth/signin">
                  <a className="nav-link">Sign In</a>
                </Link>
              </li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link href="/auth/signout">
                  <a className="nav-link">Sign Out</a>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Header;
