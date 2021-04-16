import React, {useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from "react-native";

export default function Ajouter({route, navigation}) {
    console.log("AJOUTER")
    const {products} = route.params;

    //console.log(products.data)
    //const productList = products.data.map(product => product.name);

    const [productInfo, setProductInfo] = useState({price:'', productId:''});

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

    return (
        <View style={styles.container}>
            <Text style={styles.priceText}>Product price</Text>
            <View style={{padding: 20, flexDirection: 'row'}}>
                <TextInput
                    style={{textAlign: 'right', fontSize:28}}
                    placeholder="Price"
                    onChangeText={(price) => setProductInfo({...productInfo, price:price})}
                    keyboardType={"decimal-pad"}
                />
                <Text style={{fontSize: 28}}> CHF</Text>
            </View>

            <Text style={styles.productText}>Product selection</Text>
            <View style={styles.selection}>
                <RNPickerSelect
                    placeholder={{label: 'Select a product', value: null}}
                    onValueChange={(value) => setProductInfo({...productInfo, productId:value})}
                    items={productList()}
                />
            </View>
            <Text style={styles.qrText}>Scan QR</Text>
            <TouchableOpacity
                onPress={() => console.log(productInfo)} //alert('Bouton visualiser')}
                style={styles.bAdd}>
                <Text style={styles.scanText}>Ajouter</Text>
            </TouchableOpacity>
        </View>
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
    dropDown:{
        backgroundColor:'#0e131e',
        padding:20,
        paddingLeft:15,
        paddingRight:15,
        fontSize:25,
    },
});
