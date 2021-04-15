import React, {useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from "react-native";

export default function Ajouter() {
    const [text, setText] = useState('');
    return (
        <View style={styles.container}>
            <Text style={styles.priceText}>Product price</Text>
            <View style = {{padding:20,flexDirection:'row'}}>
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
            <RNPickerSelect
                //style={{fontSize: 28}}
                //style={{textAlign: 'right'}}
                //placeholder={label: 'Choose a product...', value: null}
                onValueChange={(value) => console.log(value)}
                items={[
                    {label: "JavaScript", value: "JavaScript"},
                    {label: "TypeStript", value: "TypeStript"},
                    {label: "Python", value: "Python"},
                    {label: "Java", value: "Java"},
                    {label: "C++", value: "C++"},
                    {label: "C", value: "C"},
                ]}
                //placeholder={"Choose a product"}
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
    }

});
