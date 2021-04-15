import React, {useState} from "react";
import QR from "./admin/QR/QR";
import QRCodeCreator from "./admin/QR/QRCodeCreator";


function MainPage(props) {
    return (
        <div>
            <QR {...props}/>
        </div>
    );
};
export default MainPage;