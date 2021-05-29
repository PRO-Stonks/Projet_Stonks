import React, {useEffect, useState} from "react";
import {Text, View, TextInput, TouchableOpacity, Keyboard, TouchableWithoutFeedback,} from "react-native";
import getCurrentDate from "../utils/getDate.js";
import Scan from './Scan.js';
import API_URL from "../utils/url";
import List from "../lists/List";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import ItemListProduct from "../lists/ItemListProduct";
import addElement from "../request/addElement";
import styles from "../styles/AddStyle";

/**
 * Add component to display add view and allowing addition of an item
 * @param route route containing useful parameters
 * @param navigation navigation props
 * @returns {JSX.Element} Add view
 */
export default function Add({route, navigation}) {
    const {products, token, location} = route.params;
    // state to store product info
    const [productInfo, setProductInfo] = useState({entryDate: getCurrentDate, idLocation: location._id});
    // state to check if the scan must be displayed
    const [isScan, setScan] = useState(false);
    // state to check if the product list must be displayed
    const [isEnableProductList, setIsEnableProductList] = useState(false);
    // state to store scan id
    const [scanId, setScanId] = useState(null);
    // state to check if the date picker must be displayed
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    /**
     * Add a product after scan
     */
    useEffect(() => {
        if (scanId) {
            setProductInfo({...productInfo, code: scanId})
            const body = {
                ...productInfo, code: scanId, idProduct: productInfo.idProduct._id
            }
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
            alert("Element has been added successfully")
            return res;
        } else {
            alert("Error: " + res.message)
            throw res;
        }
    }

    /**
     * Return a view containing a list of product
     * @param item product to display
     * @returns {JSX.Element} list of item view
     */
    const renderProductItem = ({item}) => {
        if (!item) {
            throw DOMError;
        }
        return (
            <ItemListProduct
                item={item}
                onPress={() => setProductId(item)}
            />
        );
    };

    function setProductId(item) {
        setProductInfo({...productInfo, idProduct: item});
        setIsEnableProductList(false);
    }

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

    return (
        isEnableProductList ? <List token={token} url="products" renderItemHandler={renderProductItem}/> :
            isScan ? <Scan scanId={scanId} setScanId={setScanId}/> :
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>

                        <Text style={styles.text}>Product price</Text>
                        <View style={{padding: 20, flexDirection: 'row'}}>
                            <TextInput
                                style={{textAlign: 'right', fontSize: 28}}
                                placeholder="Price"
                                defaultValue={productInfo.price == null ? 0 : productInfo.price}
                                onChangeText={(price) => setProductInfo({...productInfo, price: price})}
                                keyboardType={"decimal-pad"}
                            />
                            <Text style={{fontSize: 28}}> CHF</Text>
                        </View>

                        <Text style={styles.text}>Product selection</Text>
                        <TouchableOpacity onPress={() => setIsEnableProductList(true)} style={styles.item}>
                         <Text style={styles.selection}>{productInfo.idProduct == null ? "Click to select" : productInfo.idProduct.name}</Text>
                        </TouchableOpacity>

                        <Text style={styles.text}>Exit date selection</Text>
                        <TouchableOpacity onPress={showDatePicker}>
                            <Text style={styles.selection}>{productInfo.exitDate == null ? "Click to select" : productInfo.exitDate}</Text>
                        </TouchableOpacity>
                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            minimumDate={new Date(getCurrentDate)}
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




