import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

//data.map
export default function Options({navigation, data}) {
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
                    onPress={() => navigation.navigate('Scan')}
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

const styles = StyleSheet.create({
    buttonsContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    titleText: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    bodyContainer: {
        flex: 2,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 50,
    },
    bText: {
        fontSize: 25,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    bVisualize: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightskyblue',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    bAdd: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'darkseagreen',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    bSupress: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'lightsalmon',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
});
