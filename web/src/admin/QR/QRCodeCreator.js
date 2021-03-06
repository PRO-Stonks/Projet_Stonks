import React, {useRef} from "react";
import Spinner from "../../utils/Spinner";
import QRCode from 'qrcode'

function QRCodeCreator(props) {
    const canvasRef = useRef(null);
    if (props.data && props.data.code !== "") {
        QRCode.toCanvas(canvasRef.current, props.data.code).then(res => console.log("ok")).catch(err => console.log(err))
    }

    return (
        <div ref={props.ref}>
            <canvas ref={canvasRef}/>
            <Spinner enabled={props.data && props.data.fetching}/>
        </div>

    );
}

export default QRCodeCreator;