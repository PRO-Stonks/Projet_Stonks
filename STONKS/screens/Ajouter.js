import React from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View} from "react-native";


export default function Ajouter ({route, navigation}) {
    console.log("AJOUTER")
    const {products} = route.params;

    //console.log(products.data)
    //const productList = products.data.map(product => product.name);
    /**
     * Generate list of products name to display in dropdown list
     * @returns {*} : array of products name
     */
    const productList = () => {
        return products.data.map(product => ({
            label: product.name,
            value: product.name,
        }));
    }

    return (
        <View style={styles.container}>
            <Text>products: {JSON.stringify(products)}</Text>
            <Text>Hello World!</Text>
            <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={productList()}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container : {
        flex            : 1,
        backgroundColor : "#fff",
        alignItems      : "center",
        justifyContent  : "center",
    },
});
