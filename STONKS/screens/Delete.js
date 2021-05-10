import React, {useEffect, useState} from "react";
import Scan from './Scan.js';
import deleteElement from '../request/deleteElement.js';
import API_URL from "../url";

export default function Delete({route}) {
    console.log("DELETE")

    const {token} = route.params;

    // state to store scan id
    const [scanId, setScanId] = useState(null);

    useEffect(() => {
        if (scanId) {
            console.log("SCAN CHANGED")
            fetchData(scanId).then(r => console.log(r)).catch(r => console.log(r));
            setScanId(null);
        }
    }, [scanId])

    async function fetchData(data) {
        const res = await deleteElement(API_URL + 'elements/QR/' + data, token);
        if (res.status === 'success') {
            console.log("DELETED SUCCESSFULLY")
            alert(res.message);
            return res;
        } else {
            alert(res.message);
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>
}
