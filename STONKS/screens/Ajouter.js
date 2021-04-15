import React from "react";
import RNPickerSelect from "react-native-picker-select";
import { StyleSheet, Text, View } from "react-native";


export default function Ajouter ({route, navigation}) {
    console.log("AJOUTER")
    const {products} = route.params;
    console.log(products)

    return (
        <View style={styles.container}>
            <Text>products: {JSON.stringify(products)}</Text>
            <Text>Hello World!</Text>
            <RNPickerSelect
                onValueChange={(value) => console.log(value)}
                items={[
                    { label: "JavaScript", value: "JavaScript" },
                    { label: "TypeStript", value: "TypeStript" },
                    { label: "Python", value: "Python" },
                    { label: "Java", value: "Java" },
                    { label: "C++", value: "C++" },
                    { label: "C", value: "C" },
                ]}
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
