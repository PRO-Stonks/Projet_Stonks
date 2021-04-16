import React, {useState, useEffect} from "react";
import QRCodeCreator from "./QRCodeCreator";
import PrinterWrapper from "./PrinterWrapper";
import API_URL from "../../URL";


async function askForQR(token) {
    try {
        console.log(token)
        const response = await fetch(API_URL + 'QR/add', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}

function QR(props) {
    const [data, setFetching] = useState({fetching: false, code: ""});

    useEffect( () => {
        async function createQR(){
            const QR = await askForQR(props.token);
            console.log(QR.data);
            return QR;
        }
        if(data.fetching){
             createQR().then(qr => {
                     setFetching({code: qr.data.code, fetching: false})
                 }
             );
        }
    }, [data.fetching, props]);
    
    return (
        <div>
            <button onClick={() => setFetching({data, fetching: true})}>
                Generate QR
            </button>
            <PrinterWrapper children={QRCodeCreator({setFetching, data})}/>
        </div>
    );
}
export default QR;