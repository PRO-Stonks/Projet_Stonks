import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const ItemListLocation = ({item, onPress}) => {
    return <TouchableOpacity onPress={onPress} style={styles.item}>
        <Text style={styles.title}>{item.name}</Text>
    </TouchableOpacity>
};


const styles = StyleSheet.create({
    item: {
        padding: 15,
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: "#DCDCDC",
        textAlign: 'center'
    },
    title: {
        fontSize: 32,
    },
});
export default ItemListLocation;
