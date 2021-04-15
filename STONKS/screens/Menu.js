import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Options from "./Options";
import API_URL from "../url";
import {UserContext} from "../UserContext";
import getProducts from '../request/getProducts.js';


export default function Menu(props) {
    const userData = useContext(UserContext);
    //console.log(userData)

    /**
     * Product state (product will contain the list of products
     */
    const [product, setProduct] = useState([]);

    /**
     * to keep?
     */
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);

    /**
     * Get products when we get on this screen
     */
    async function fetchData() {
        const res = await getProducts(API_URL + 'products', userData.state.token);
        if (res.status === 'success') {
            return res;
        } else {
            throw res;
        }
    }

    useEffect(() => {
        fetchData().then(r => setProduct(r)).catch(r => console.log(r))
    },[]);

    /**
     * Menu view
     */
    return (
        <View style={styles.buttonsContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Options</Text>
            </View>

            <Options navigation={props.navigation} data={product}/>

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
