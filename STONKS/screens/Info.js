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
           fetchData(scanId).then(r => {
                console.log(r)
                    console.log("RES                               AHHAHAHHHHHHHHHHHHHHHHhAHHAHAHAHAHAHHA");
                    console.log(r);
                    navigation.navigate('Info', {
                        element: r,
                    });
            }
            ).catch(r => console.log(r));

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
        const res = await getElement(API_URL + 'elements/QR/' + data + '?populateField=idProduct,idLocation&populateValue[idProduct]=name&populateValue[idLocation]=name', token);
        if (res.status === 'success') {
            console.log(res)
            return {
                name: res.data.idProduct.name,
                price: res.data.price,
                entryDate: new Date(res.data.entryDate).toLocaleDateString(),
                exitDate: new Date(res.data.exitDate).toISOString().split('T')[0],
                location: res.data.idLocation.name,
            };
        } else {
            alert("Error: " + res.message);
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>
}
