import React, {useEffect, useState} from "react";
import Scan from './Scan.js';
import API_URL from "../url";
import getElement from '../request/getElement.js'


export default function Info({route, navigation}) {
    // get user token
    const {token} = route.params;
    // store scan id
    const [scanId, setScanId] = useState(null);

    useEffect(() => {
        if (scanId) {
            console.log("SCAN CHANGED")
            fetchData(scanId).then(r => console.log(r)).catch(r => console.log(r));
            setScanId(null);
            navigation.navigate('DisplayInfo')
        }
    }, [scanId])

    /**
     * Call request to delete an element
     * @param data : id of the scanned element
     * @returns {Promise<*>} : request response
     */
    async function fetchData(data) {
        console.log(API_URL + 'elements/QR/' + data)
        const res = await getElement(API_URL + 'elements/QR/' + data, token);
        if (res.status === 'success') {
            console.log(res)
            return res;
        } else {
            alert("Error: " + res.message);
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>
}
