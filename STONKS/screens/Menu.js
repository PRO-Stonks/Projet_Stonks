import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React from 'react';

export default function Menu({navigation}) {
    return (
        <View style={styles.buttonsContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Options</Text>
            </View>

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
        backgroundColor: 'blue',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    bAdd: {
        backgroundColor: 'green',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
    bSupress: {
        backgroundColor: 'red',
        padding: 30,
        borderRadius: 5,
        width: '60%',
        height: '25%',
    },
});
