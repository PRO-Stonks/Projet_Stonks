import React, {useEffect, useState} from "react";
import Scan from './Scan.js';
import API_URL from "../utils/url";
import getElement from '../request/getElement.js'

/**
 * Info component to redirect to the display info screen after scanning
 * @param route route containing useful parameters
 * @param navigation navigation route
 * @returns {JSX.Element} Scan view allowing to get an item info
 * @constructor
 */
export default function Info({route, navigation}) {
    // get user token
    const {token, location} = route.params;
    // store scan id
    const [scanId, setScanId] = useState(null);

    /**
     * Check for item scan to display info
     */
    useEffect(() => {
        if (scanId) {
           fetchData(scanId).then(r => {
                    navigation.navigate('Info', {
                        element: r,
                        location: location,
                        token: token
                    });
            }
            ).catch(r => console.log(r));

            setScanId(null);
        }
    }, [scanId])

    /**
     * Call request to delete an element
     * @param data : id of the scanned element
     * @returns {Promise<*>} : server response
     */
    async function fetchData(data) {
        const res = await getElement(API_URL + 'elements/QR/' + data + '?populateField=idProduct,idLocation&populateValue[idProduct]=name&populateValue[idLocation]=name', token);
        if (res.status === 'success') {
            const entryDate = new Date(res.data.entryDate);
            const exitDate = new Date(res.data.exitDate);
            return {
                name: res.data.idProduct.name,
                id: res.data._id,
                price: res.data.price,
                entryDate: entryDate.getDate()+"/"+(entryDate.getMonth()+1)+"/"+entryDate.getFullYear(),
                ...(res.data.exitDate && {exitDate: exitDate.getDate()+"/"+(exitDate.getMonth()+1)+"/"+exitDate.getFullYear()}),
                location: res.data.idLocation,
            };
        } else {
            alert("Error: " + res.message);
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>
}
