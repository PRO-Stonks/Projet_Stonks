import React, {useEffect, useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from "react-native";
import getCurrentDate from "../utils/getDate.js";
import Scan from './Scan.js';
import API_URL from "../url";

async function deleteElement(url, token, data) {
    //console.log(token)
    try {
        const response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
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
            body: JSON.stringify(data)
        });
        return response.json();
    } catch (e) {
        console.log("Error")
        console.log(e);
    }
}


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
        const res = await deleteElement(API_URL + 'elements/delete', token, data);
        console.log(data)
        if (res.status === 'success') {
            console.log("YOUHOUHOU");
            return res;
        } else {
            console.log("BAAAAAAAAAAAAAA");
            throw res;
        }
    }

    return <Scan scanId={scanId} setScanId={setScanId}/>

}
