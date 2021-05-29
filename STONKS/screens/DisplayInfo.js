import {Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import API_URL from "../url";
import moveElement from "../request/moveElement";
import getLocation from "../request/getLocation";
import styles from "../styles/DisplayInfoStyle.js";

export default function DisplayInfo({navigation, route}) {
    // get data
    const {element, location, token} = route.params;
    // state to handle location change
    const [isLocationChange, setLocationChange] = useState();
    // state to store location name
    const [locationName, setLocationName] = useState(element.location.name)

    const changeLocation = () => {
        moveData().then(r => console.log(r)).catch(r => console.log(r));
        fetchData().then(r => { setLocationName(r.data.name)}).catch(r => console.log(r));
        setLocationChange(false)
    }

    function ShowLocationChange(){
        if (isLocationChange) {
            return <TouchableOpacity
                onPress={changeLocation}
                style={styles.bLocation}>
                <Text style={styles.bText}>Change location</Text>
            </TouchableOpacity>
        } else {
            return null;
        }
    }

    useEffect(() => {
        setLocationChange(false)
        if (location.name !== element.location.name) {
            setLocationChange(true);
        }
    }, [])

    async function moveData() {
        const res = await moveElement(API_URL + 'elements/move/' + element.id + '/' + location._id, token);
        if (res.status === 'success') {
            alert("Element has been moved successfully")
            return res;
        } else {
            alert("Error: " + res.message)
            throw res;
        }
    }

    async function fetchData() {
        const res = await getLocation(API_URL + 'locations/' + location._id, token);
        if (res.status === 'success') {
            return res;
        } else {
            alert("Error: " + res.message)
            throw res;
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.iView}>
                <Text style={styles.text}>Product: {element.name}</Text>
                <Text style={styles.text}>Price: {element.price} .-</Text>
                <Text style={styles.text}>Entry date: {element.entryDate}</Text>
                {element.exitDate && <Text style={styles.text}>Exit date: {element.exitDate}</Text>}
                <Text style={styles.textL}>Location: {locationName}</Text>
            </View>

            <View style={styles.bView}>
                <ShowLocationChange/>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Menu');
                    }}
                    style={styles.button}>
                    <Text style={styles.bText}>Back to menu</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


