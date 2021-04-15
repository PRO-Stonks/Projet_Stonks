import React, { useState } from "react";
import {FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity} from "react-native";

//export default function Visualiser() {


    const DATA = [
        {
            id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
            title: "First Item",
        },
        {
            id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
            title: "Second Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
        {
            id: "58694a0f-3da1-471f-bd96-145571e29d72",
            title: "Third Item",
        },
    ];

    const Item = ({item, onPress, backgroundColor, textColor}) => (
        <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
            <Text style={[styles.title, textColor]}>{item.title}</Text>
        </TouchableOpacity>
    );



const Visualiser = () => {
        const [selectedId, setSelectedId] = useState(null);

        const renderItem = ({item}) => {
            const backgroundColor = item.id === selectedId ? "#C08924" : "#FAA91A";
            const color = item.id === selectedId ? 'white' : 'black';

            return (
                <Item
                    item={item}
                    onPress={() => setSelectedId(item.id)}
                    backgroundColor={{backgroundColor}}
                    textColor={{color}}
                />
            );
        };


        return (

            <SafeAreaView style={styles.container}>

                <FlatList
                    data={DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    extraData={selectedId}
                />
            </SafeAreaView>
        );
    };

//}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
    item: {
        padding: 10,
        marginVertical: 6,
        marginHorizontal: 90,
    },
    title: {
        fontSize: 22,
    },
});
export default Visualiser;

