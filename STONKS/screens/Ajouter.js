import React, {useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from "react-native";

export default function Ajouter() {
    const [text, setText] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.priceText}>Product price</Text>
            <TextInput
                style={{height: 50}}
                placeholder="Price of the product in CHF"
                onChangeText={text => setText(text)}
                defaultValue={text}
                keyboardType={"decimal-pad"}
                style={styles.input}
            />
            <Text style={styles.testText}>CHF</Text>

            <Text style={styles.productText}>Product</Text>

            <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                    {label: "JavaScript", value: "JavaScript"},
                    {label: "TypeStript", value: "TypeStript"},
                    {label: "Python", value: "Python"},
                    {label: "Java", value: "Java"},
                    {label: "C++", value: "C++"},
                    {label: "C", value: "C"},
                ]}
            />
            <Text style={styles.productText}>QR Scan</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Scan')} //alert('Bouton visualiser')}
                style={styles.bAdd}>
                <Text style={styles.priceText}>Visualiser</Text>
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
    bAdd: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'darkseagreen',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    priceText: {
        marginTop: 30,
        fontSize: 30,
        fontWeight: 'bold',
    },
    productText: {
        flex: 2,
        fontSize: 30,
        fontWeight: 'bold',
    },
    testText: {
        flex: 2,
        fontSize: 15,
        fontWeight: 'bold',
        flexDirection: "row",

    },

    scanText: {
        flex: 1,
        fontSize: 40,
        fontWeight: 'bold',
    },
    input: {
        //width: 250,
        fontSize: 18,
        height: 44,
        padding: 10,
        //borderWidth: 1,
        //borderColor: 'black',
        marginVertical: 10,
        flexDirection: "row",
        flexWrap: 'wrap',
        flex: 1

    },
});
