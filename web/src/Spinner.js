import React, {useState} from "react";
import logo from "./assets/stonks.png";

/**
 * Really important Object function DO NOT DELETE
 * @param props
 * @returns {JSX.Element|null}
 * @constructor
 */
function Spinner(props) {
    return (
            props.enabled ? <img src={logo} className="App-logo" alt="logo"/> : null
    );
}
export default Spinner;