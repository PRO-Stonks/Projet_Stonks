import React, {useState} from "react";
import RNPickerSelect from "react-native-picker-select";
import {StyleSheet, Text, View, TextInput} from "react-native";


export default function Ajouter() {
    const [text, setText] = useState('');
    return (
        <View style={styles.container}>
            <Text>Price</Text>
            <TextInput
                style={{height: 40}}
                placeholder="Price of the product in CHF"
                onChangeText={text => setText(text)}
                defaultValue={text}
                keyboardType={"decimal-pad"}
            />

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


        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
