import {Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import styles from '../styles/MenuStyle';

/**
 * Options component displaying and handling the get info, add and delete button in the Menu
 * @param navigation: navigation props
 * @param data: product list
 * @param token: user token
 * @param location: user location
 * @returns {JSX.Element} Options view
 */
export default function Options({navigation, data, token, location}) {

    return (
        <View style={styles.bodyContainer}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Scan for info', {
                        token: token,
                        location: location
                    });
                }}
                style={styles.bVisualize}>
                <Text style={styles.bText}>Get info</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Add', {
                        products: data,
                        token: token,
                        location: location
                    });
                }}
                style={styles.bAdd}>
                <Text style={styles.bText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Scan for delete', {
                        token: token,
                    });
                }}
                style={styles.bDelete}>
                <Text style={styles.bText}>Delete</Text>
            </TouchableOpacity>
        </View>

    );
}


