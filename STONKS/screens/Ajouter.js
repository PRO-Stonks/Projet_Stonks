import React, {useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView} from "react-native";

export default function Ajouter({navigation}) {
    const [text, setText] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.priceText}>Product price</Text>
            <View style={{padding: 20, flexDirection: 'row'}}>
                <TextInput
                    style={{textAlign: 'right', fontSize: 28}}
                    placeholder="Price"
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                    keyboardType={"decimal-pad"}
                />
                <Text style={{fontSize: 28}}> CHF</Text>
            </View>

            <Text style={styles.productText}>Product selection</Text>
            <View style={styles.selection}>
                    <RNPickerSelect
                        placeholder={{label: 'Select a product', value: null}}

                        onValueChange={(value) => console.log(value)}
                        items={[
                            {label: "Test1", value: "Test2"},
                            {label: "TypeStript", value: "TypeStript"},
                            {label: "Python", value: "Python"},
                            {label: "Java", value: "Java"},
                            {label: "C++", value: "C++"},
                            {label: "C", value: "C"},
                        ]}
                        style={pickerSelectStyles}
                    />
            </View>
            <Text style={styles.qrText}>QR code</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Scan')} //alert('Bouton visualiser')}
                style={styles.bAdd}>
                <Text style={styles.scanText}>Scan</Text>
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
        padding: 40,
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
        padding: 10,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
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
