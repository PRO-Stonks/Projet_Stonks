import React, {useEffect, useState, useRef} from "react";
import API_URL from "../../URL";
import Spinner from "../../Spinner";
import QRCode from 'qrcode'



function QRCodeCreator(props) {
    console.log(props);
    console.log("QRCreator ")
    console.log(props.data)
    const canvasRef = useRef(null);
    if(props.data && props.data.code !== ""){
        QRCode.toCanvas(canvasRef.current, 'Nique SER'+props.data.code)
    }

    return (
        <div ref={props.ref}>

            <canvas ref={canvasRef}/>
            <Spinner enabled={props.data && props.data.fetching}/>
        </div>

    );
}

export default QRCodeCreator;