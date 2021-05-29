import React, { useState, useEffect } from 'react';
import {Text, View, StyleSheet, Button, TouchableOpacity} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import styles from "../styles/ScanStyle.js";

export default function Scan(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        //alert(`Bar code with type ${type} and data ${data} has been scanned!`);
        props.setScanId(data)
    };

    if (hasPermission === null) {
        return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
            {scanned && <TouchableOpacity
                onPress={() => setScanned(false)}
                style={styles.button}>
                <Text style={styles.text}>Tap to Scan Again</Text>
            </TouchableOpacity>}
        </View>
    );
}


