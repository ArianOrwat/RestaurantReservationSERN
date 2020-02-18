import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { ReactComponent as Logo } from "../../assets/logo.svg";
import "./Header.scss";

const Header = ({ login, logInState }) => (
      <div className="header">
        <div className="logo-container">
          <Logo className="logo" />
        </div>
        <div className="options">
          <NavLink className="option" activeClassName="active" exact to="/">
            Home
          </NavLink>
          <NavLink
            className="option"
            activeClassName="active"
            to="/reservation"
          >
            Reservation
          </NavLink>
          <NavLink className="option" activeClassName="active" to="/menu">
            Menu
          </NavLink>
          {login ? (
            <NavLink
              className="option"
              onClick={() => {
                localStorage.removeItem("token");
                logInState();
              }}
              exact
              to="/"
            >
              Sign out
            </NavLink>
          ) : (
            <NavLink className="option" activeClassName="active" to="/sign-in">
              Sign in
            </NavLink>
          )}
        </div>
      </div>
    );

export default Header;
