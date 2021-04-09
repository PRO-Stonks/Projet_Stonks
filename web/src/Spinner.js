import React, {useState} from "react";
import logo from "./assets/stonks.png";

function Spinner(props) {
    return (
            props.enabled ? <img src={logo} className="App-logo" alt="logo"/> : null

    );
}
export default Spinner;