import { Text, View, TouchableOpacity } from 'react-native';
import React, {useState} from 'react';
import styles from '../styles/MenuStyle';


/**
 * TO DO: Requêtes pour visualiser et supprimer
 */

export default function Options({navigation, data, token, location}) {
    console.log("OPTIONS")

    /**
     * Options view -> 3 buttons
     */
    return (
            <View style={styles.bodyContainer}>
                <TouchableOpacity
                    onPress={() => alert('Bouton visualiser')}
                    style={styles.bVisualize}>
                    <Text style={styles.bText}>Get info</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Add', {
                            products: data,
                            token: token,
                            location
                        });
                    }}
                    style={styles.bAdd}>
                    <Text style={styles.bText}>Add</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => displaySan()}
                    style={styles.bSupress}>
                    <Text style={styles.bText}>Delete</Text>
                </TouchableOpacity>
            </View>

    );
}


