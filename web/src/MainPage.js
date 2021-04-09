import React, {useState} from "react";
import logo from "./assets/stonks.png";


function MainPage(props) {
    return (
        <div>{props.user.email} {props.token.toString()}</div>
    );
};
export default MainPage;