import React, {useEffect, useState} from "react";
import Scan from './Scan.js';
import API_URL from "../url";
import getElement from '../request/getElement.js'


export default function Info({route, navigation}) {
    // get user token
    const {token} = route.params;
    // store scan id
    const [scanId, setScanId] = useState(null);
    // state to store element info
    const [elementInfo, setElementInfo] = useState({});

    useEffect(() => {
        if (scanId) {
            fetchData(scanId).then(r => console.log(r)).catch(r => console.log(r));
            setScanId(null);
            navigation.navigate('DisplayInfo', {
                element: elementInfo,
            });
        }
    }, [scanId])

    /**
     * Call request to delete an element
     * @param data : id of the scanned element
     * @returns {Promise<*>} : request response
     */
    async function fetchData(data) {
        console.log(API_URL + 'elements/QR/' + data)
        const res = await getElement(API_URL + 'elements/QR/' + data + '?populateField=idProduct,idLocation&populateValue[idProduct]=name&populateValue[idLocation]=name', token);
        if (res.status === 'success') {
            //TO DO: deal with location
            setElementInfo({...elementInfo,
                name: res.data.idProduct.name,
                price: res.data.price,
                entryDate: new Date(res.data.entryDate).toISOString().split('T')[0],
                exitDate: new Date(res.data.exitDate).toISOString().split('T')[0],
            })
            return res;
        } else {
            alert("Error: " + res.message);
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>
}
