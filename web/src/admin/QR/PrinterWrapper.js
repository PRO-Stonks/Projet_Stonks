import React, {useRef} from "react";
import ReactToPrint from "react-to-print";

const QRCode = require('qrcode.react');

export default function PrinterWrapper(props) {
    const linkToPrint = () => {
        return (
            <button className="btn-secondary">Click To Print</button>
        )
    }

    const componentRef = useRef();
    return (
        <div>
            <div ref={componentRef}>
                {
                    props.codes.map((code) => {
                        return <React.Fragment><QRCode value={code} includeMargin="true"/>&nbsp;&nbsp;</React.Fragment>;
                    })
                }
            </div>
            <ReactToPrint trigger={linkToPrint} content={() => componentRef.current}/>
        </div>
    );
}
