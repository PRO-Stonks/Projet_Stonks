import React from "react";
import {Link, withRouter} from "react-router-dom";
import logo from "../assets/Webp.net-resizeimage.png"

/*
    The only diff with navWelcome is the log-Out button
 */
function NavAdmin(props) {
    return (
        <div className="navigation">
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <Link class="navbar-brand" to="/">
                        <img src={logo} alt="logo"/> Stonks
                    </Link>
                    <div>
                        <ul className="navbar-nav ml-auto">
                            <li className={`nav-item  ${props.location.pathname === "/" ? "active" : ""}`}>
                                <Link class="nav-link" to="/">
                                    Home
                                    <span className="sr-only">(current)</span>
                                </Link>
                            </li>
                            <li className={`nav-item  ${props.location.pathname === "/about" ? "active" : ""}`}>
                                <Link class="nav-link" to="/about">
                                    About
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div><Link className="btn btn-dark" onClick={props.handleLogOut} to="/">Log out</Link></div>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(NavAdmin);