import { Text, View, TouchableOpacity } from 'react-native';
import React from 'react';
import styles from '../styles/MenuStyle';

/**
 * TO DO: Requêtes pour visualiser et supprimer
 */

export default function Options({navigation, data, token}) {
    console.log("OPTIONS")

    /**
     * Options view -> 3 buttons
     */
    return (
            <View style={styles.bodyContainer}>
                <TouchableOpacity
                    onPress={() => alert('Bouton visualiser')}
                    style={styles.bVisualize}>
                    <Text style={styles.bText}>Visualiser</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('Ajouter', {
                            products: data,
                            token: token,
                        });
                    }}
                    style={styles.bAdd}>
                    <Text style={styles.bText}>Ajouter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => alert('Bouton supprimer')}
                    style={styles.bSupress}>
                    <Text style={styles.bText}>Supprimer</Text>
                </TouchableOpacity>
            </View>

    );
}


