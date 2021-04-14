import React, {useState} from "react";
import logo from "./assets/stonks.png";
import QRCodeCreator from "./admin/QRCodeCreator";


function MainPage(props) {
    return (
        <div>
            <QRCodeCreator token={props.token}/>

        </div>
    );
};
export default MainPage;