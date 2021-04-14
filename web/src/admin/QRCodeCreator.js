import React, {useEffect, useState, useRef} from "react";
import API_URL from "../URL";
import Spinner from "../Spinner";
import QRCode from 'qrcode'

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

function QRCodeCreator(props) {
    const [fetching, setFetching] = useState(false);

    const canvasRef = useRef(null)


    useEffect( () => {
        async function createQR(){
            const QR = await askForQR(props.token);
            console.log(QR.data);
            const canvas = canvasRef.current
            await QRCode.toCanvas(canvas, 'Nique SER'+QR.data.code)
        }
        if(fetching){
            createQR();
            setFetching(false);
        }
    }, [fetching, props]);
    return (
        <>
            <button onClick={() => setFetching(true)}>
                Generate QR
            </button>
            <canvas ref={canvasRef} {...props}/>
            <Spinner enabled={fetching}/>
        </>

    );
}

export default QRCodeCreator;