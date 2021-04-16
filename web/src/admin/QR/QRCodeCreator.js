import React, {useRef} from "react";
import Spinner from "../../Spinner";
import QRCode from 'qrcode'

function QRCodeCreator(props) {
    console.log(props);
    console.log("QRCreator ")
    console.log(props.data)
    console.log("Aaaaaaa")
    const canvasRef = useRef(null);
    if(props.data && props.data.code !== ""){
        console.log(props.data)
        QRCode.toCanvas(canvasRef.current, props.data.code)
    }

    return (
        <div ref={props.ref}>

            <canvas ref={canvasRef}/>
            <Spinner enabled={props.data && props.data.fetching}/>
        </div>

    );
}

export default QRCodeCreator;