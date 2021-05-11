import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from "react";

export default function DisplayInfo({navigation, route}) {

    const {element} = route.params;

    return (
        <View style={styles.container}>
            <View style={styles.info}>
                <Text style={styles.name}>Product: {element.name}</Text>
                <Text style={styles.name}>Price: {element.price}</Text>
                <Text style={styles.name}>Entry date: {element.entryDate}</Text>
                <Text style={styles.name}>Exit date: {element.exitDate}</Text>
            </View>
            <View style={styles.b}>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Menu');
                    }}
                    style={styles.bVisualize}>
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
    info: {
        flex: 3,
        marginTop: '10%',
        backgroundColor: "white",
        alignItems: 'center',
        flexDirection: 'column',
    },
    name: {
        fontSize: 25,
        marginBottom: '10%',
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    b: {
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
    bVisualize: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightskyblue',
        marginTop: '10%',
        padding: 15,
        borderRadius: 5,
        height: '35%',
    },

});
