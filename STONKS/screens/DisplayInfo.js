import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from "react";

export default function DisplayInfo({navigation, route}) {

    const {element, location} = route.params;

    const [isLocationChange, setLocationChange] = useState();

    const changeLocation = () => {
        console.log("lol")
    }

    function ShowLocationChange(){
        if(isLocationChange) {
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
        if (location.name !== element.location) {
            setLocationChange(true);
        }
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.iView}>
                <Text style={styles.text}>Product: {element.name}</Text>
                <Text style={styles.text}>Price: {element.price} .-</Text>
                <Text style={styles.text}>Entry date: {element.entryDate}</Text>
                <Text style={styles.text}>Exit date: {element.exitDate}</Text>
                <Text style={styles.text}>Location: {element.location}</Text>
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
        marginTop: '10%',
        padding: 15,
        borderRadius: 5,
        height: '35%',
    },

});
