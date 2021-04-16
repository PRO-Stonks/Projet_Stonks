import React, {useEffect, useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback} from "react-native";
import getCurrentDate from "../utils/getDate.js";
import Scan from './Scan.js';
import API_URL from "../url";

async function addElement(url, token, data) {
    //console.log(token)
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
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

export default function Ajouter({route, navigation}) {
    console.log("AJOUTER")
    const {products, token} = route.params;

    const [productInfo, setProductInfo] = useState({entryDate: getCurrentDate, idLocation:"", exitDate:"",});

    const [isScan, setScan] = useState(false);

    const [scanId, setScanId] = useState({});

    useEffect(() => {
        console.log("SCAN CHANGED")
        setProductInfo({...productInfo, code: scanId.code})
        console.log(productInfo)
        fetchData().then(r => console.log(r)).catch(r => console.log(r))
    }, [scanId])


    /**
     * Generate list of products name to display in dropdown list
     * @returns {*} : array of products name
     */
    const productList = () => {
        return products.data.map(product => ({
            label: product.name,
            value: product._id,
        }));
    }

    /**
     * Validate data enter by user
     */
    const dataValidate = () => {
        if (productInfo.idProduct != null && productInfo.price != null) {
            setScan(true);
        } else {
            alert("Please provide all informations before scanning");
        }
    }

    async function fetchData() {
        const res = await addElement(API_URL + 'elements/add', token, productInfo);
        if (res.status === 'success') {
            console.log("YOUHOUHOU");
            return res;
        } else {
            console.log("BAAAAAAAAAAAAAA");
            throw res;
        }
    }

    return (
        isScan ? <Scan scanId={scanId} setScanId={setScanId}/> :
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.priceText}>Product price</Text>
                <View style={{padding: 20, flexDirection: 'row'}}>
                    <TextInput
                        style={{textAlign: 'right', fontSize: 28}}
                        placeholder="Price"
                        onChangeText={(price) => setProductInfo({...productInfo, price: price})}
                        keyboardType={"decimal-pad"}
                    />
                    <Text style={{fontSize: 28}}> CHF</Text>
                </View>

                <Text style={styles.productText}>Product selection</Text>
                <View style={styles.selection}>
                    <RNPickerSelect
                        placeholder={{label: 'Select a product', value: null}}
                        onValueChange={(value) => setProductInfo({...productInfo, idProduct: value})}
                        items={productList()}
                        style={pickerSelectStyles}
                    />
                </View>
                <Text style={styles.qrText}>Scan QR</Text>
               <TouchableOpacity
                    onPress={() => dataValidate()}
                    style={styles.bAdd}>
                    <Text style={styles.scanText}>Ajouter</Text>
                </TouchableOpacity>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    priceText: {
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold',
    },
    productText: {
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold',
    },
    qrText: {
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold',
    },
    bAdd: {
        backgroundColor: 'darkseagreen',
        padding: 10,
        borderRadius: 5,
        width: '50%',
        height: '15%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scanText: {
        color: '#fff',
        fontSize: 25,
        fontWeight: 'bold',
        alignItems: 'center',
        justifyContent: 'center',
    },
    selection: {
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    dropDown: {
        backgroundColor: '#0e131e',
        padding: 20,
        paddingLeft: 15,
        paddingRight: 15,
        fontSize: 25,
    },
});


const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 25,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 25,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
