import React from "react";
import { Link, withRouter } from "react-router-dom";
import logo from "../assets/Webp.net-resizeimage.png"

function Navigation(props) {
    return (
        <div className="navigation">
            <nav class="navbar navbar-expand navbar-dark bg-dark">
                <div class="container">
                    <Link class="navbar-brand" to="/">
                        <img src={logo} className="App-logo" alt="logo"/>   Stonks
                    </Link>
                    <div>
                        <ul class="navbar-nav ml-auto">
                            <li
                                class={`nav-item  ${
                                    props.location.pathname === "/" ? "active" : ""
                                }`}
                            >
                                <Link class="nav-link" to="/">
                                    Home
                                    <span class="sr-only">(current)</span>
                                </Link>
                            </li>
                            <li
                                class={`nav-item  ${
                                    props.location.pathname === "/about" ? "active" : ""
                                }`}
                            >
                                <Link class="nav-link" to="/about">
                                    About
                                </Link>
                            </li>
                            { localStorage.token ?
                                <li className={`nav-item`}>
                                    <Link class="nav-link">
                                        <button onClick={props.handleLogOut}>Log out</button>
                                    </Link>
                                </li> : ""
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default withRouter(Navigation);