import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";
import API_URL from "../url";


async function moveElement(url, token) {
    try {
        const response = await fetch(url, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
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
        });
        return response.json();
    } catch (e) {
        console.log("Error")
        console.log(e);
    }
}

async function getLocation(url, token) {
    try {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
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
        });
        return response.json();
    } catch (e) {
        console.log("Error")
        console.log(e);
    }
}



export default function DisplayInfo({navigation, route}) {

    const {element, location, token} = route.params;

    const [isLocationChange, setLocationChange] = useState();

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
                style={styles.button}>
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
            console.log('Fetch' + res)
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
                <Text style={styles.text}>Exit date: {element.exitDate}</Text>
                <Text style={styles.text}>Location: {locationName}</Text>
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


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    iView: {
        flex: 3,
        marginTop: '10%',
        backgroundColor: "white",
        alignItems: 'center',
        flexDirection: 'column',
    },
    text: {
        fontSize: 25,
        marginBottom: '8%',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bView: {
        flex: 2,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    bText: {
        fontSize: 25,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightskyblue',
        marginTop: '5%',
        padding: 15,
        borderRadius: 5,
        width : '70%',
        height: '35%',
    },

});
