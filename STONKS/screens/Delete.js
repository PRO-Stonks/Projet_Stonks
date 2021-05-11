import React, {useEffect, useState} from "react";
import Scan from './Scan.js';
import deleteElement from '../request/deleteElement.js';
import API_URL from "../url";

export default function Delete({route}) {
    // get user token
    const {token} = route.params;
    // store scan id
    const [scanId, setScanId] = useState(null);

    useEffect(() => {
        if (scanId) {
            console.log("SCAN CHANGED")
            fetchData(scanId).then(r => console.log(r)).catch(r => console.log(r));
            setScanId(null);
        }
    }, [scanId])

    /**
     * Call request to delete an element
     * @param data : id of the scanned element
     * @returns {Promise<*>} : request response
     */
    async function fetchData(data) {
        console.log(API_URL + 'elements/QR/' + data)
        const res = await deleteElement(API_URL + 'elements/QR/' + data, token);
        if (res === true) {
            alert("Element has been deleted successfully");
            return res;
        } else {
            alert("Error: " + res.message);
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>
}
