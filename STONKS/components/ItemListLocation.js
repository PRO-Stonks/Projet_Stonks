import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const ItemListLocation = ({item, onPress}) => {
    return <TouchableOpacity onPress={onPress} style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
};


const styles = StyleSheet.create({
    item: {
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: "#f9c2ff",
        textAlign: 'center'
    },
    title: {
        fontSize: 32,
    },
});
export default ItemListLocation;