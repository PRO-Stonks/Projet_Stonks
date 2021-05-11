import {Text, View} from 'react-native';
import React from "react";

export default function DisplayInfo({route}) {

    const {element} = route.params;

    return(
        <View>
            <Text>{element.name}</Text>
            <Text>{element.price}</Text>
            <Text>{element.entryDate}</Text>
            <Text>{element.exitDate}</Text>
        </View>
    )
}
