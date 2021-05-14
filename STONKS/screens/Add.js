import React, {useEffect, useState} from "react";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback, Button} from "react-native";
import getCurrentDate from "../utils/getDate.js";
import Scan from './Scan.js';
import API_URL from "../url";
import List from "../components/List";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ItemListProduct from "../components/ItemListProduct";

//Refaire styles car valeur brute like a pig


// POST request -> to move in a request package file
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

export default function Add({route, navigation}) {
    console.log("AJOUTER")

    const {products, token, location} = route.params;
    // state to store product info
    const [productInfo, setProductInfo] = useState({entryDate: getCurrentDate, idLocation:location._id});
    // state to check if we should scan
    const [isScan, setScan] = useState(false);
    const [isEnableProductList, setIsEnableProductList] = useState(false);
    // state to store scan id
    const [scanId, setScanId] = useState(null);

    useEffect(() => {
        if(scanId){
            console.log("SCAN CHANGED")
            setProductInfo({...productInfo, code: scanId})
            console.log(productInfo)
            const body = {
                ...productInfo, code: scanId, idLocation: scanId, idProduct: productInfo.idProduct._id
            }
            console.log("body:")
            console.log(body)
            fetchData(body).then(r => console.log(r)).catch(r => console.log(r));
            setScanId(null);
        }
    }, [scanId])


    /**
     * Validate users entries
     */
    const dataValidate = () => {
        if (productInfo.idProduct != null && productInfo.price != null) {
            setScan(true);
        } else {
            alert("Please provide all informations before scanning");
        }
    }

    /**
     * Call request to add an element
     * @returns {Promise<any>}
     */
    async function fetchData(data) {
        const res = await addElement(API_URL + 'elements/add', token, data);
        console.log(data)
        if (res.status === 'success') {
            console.log("YOUHOUHOU");
            return res;
        } else {
            console.log("BAAAAAAAAAAAAAA");
            throw res;
        }
    }

    function setProductId(item){
        setProductInfo({...productInfo, idProduct: item});
        setIsEnableProductList(false);
    }

    const renderProductItem = ( {item} ) => {
        if (!item){
            throw DOMError;
        }
        return (
            <ItemListProduct
                item={item}
                onPress={() => setProductId(item)}
            />
        );
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setProductInfo({...productInfo, exitDate: date.toISOString().split('T')[0]})
        hideDatePicker();
    };

    /**
     * Add view
     */
    return (
        isEnableProductList ? <List token={token} url="products" renderItemHandler={renderProductItem}/> :
        isScan ? <Scan scanId={scanId} setScanId={setScanId}/> :
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <Text style={styles.priceText}>Product price</Text>
                <View style={{padding: 20, flexDirection: 'row'}}>
                    <TextInput
                        style={{textAlign: 'right', fontSize: 28}}
                        placeholder="Price"
                        defaultValue= {productInfo.price == null ? 0: productInfo.price}
                        onChangeText={(price) => setProductInfo({...productInfo, price: price})}
                        keyboardType={"decimal-pad"}
                    />
                    <Text style={{fontSize: 28}}> CHF</Text>
                </View>

                <Text style={styles.productText}>Product selection</Text>
                <View style={styles.selection}>
                    <TouchableOpacity onPress={() => setIsEnableProductList(true)} style={styles.item}>
                        <Text style={styles.productElement}>{productInfo.idProduct == null ? "Click to select": productInfo.idProduct.name}</Text>
                    </TouchableOpacity>
                </View>

                <Button title="Select an exit date" onPress={showDatePicker} />
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                />


               <TouchableOpacity
                    onPress={() => dataValidate()}
                    style={styles.bAdd}>
                    <Text style={styles.scanText}>Scan</Text>
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
        marginTop: 50,
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
    productElement: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        textAlign: 'center',
        fontSize: 32,
    },
    datePickerStyle: {
        width: 200,
        marginTop: 20,
    },
});


