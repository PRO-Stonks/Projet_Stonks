import React, {useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from "react-native";

export default function Ajouter({navigation}) {
    const [text, setText] = useState('');

        const placeholder = {
            label: 'Select a sport...',
            value: null,
            color: '#9EA0A4'};
    return (
        <View style={styles.container}>
            <Text style={styles.priceText}>Product price</Text>
            <View style={{padding: 20, flexDirection: 'row'}}>
                <TextInput
                    style={{textAlign: 'right'}}
                    placeholder="Price"
                    onChangeText={text => setText(text)}
                    defaultValue={text}
                    keyboardType={"decimal-pad"}
                    style={{fontSize: 28}}
                />
                <Text style={{fontSize: 28}}> CHF</Text>
            </View>

            <Text style={styles.productText}>Product selection</Text>
            <View style={styles.selection}>
                <RNPickerSelect
                    placeholder={{label: 'Select a product', value: null}}
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
            </View>
            <Text style={styles.qrText}>Scan QR</Text>
            <TouchableOpacity
                onPress={() => navigation.navigate('Scan')} //alert('Bouton visualiser')}
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
        padding: 20,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "flex-start",
    },
});
