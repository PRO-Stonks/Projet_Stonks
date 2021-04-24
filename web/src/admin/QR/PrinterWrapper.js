import React, {useRef} from "react";
import ReactToPrint from "react-to-print";

export default function PrinterWrapper({children}) {
    const linkToPrint = () => {
        return (
            <button>Click To Print</button>
        )
    }

    const componentRef = useRef();
    return (
        <>
            <ReactToPrint trigger={linkToPrint} content={() => componentRef.current}/>
            <div ref={componentRef}>
                {children}
            </div>
        </>
    );
}
