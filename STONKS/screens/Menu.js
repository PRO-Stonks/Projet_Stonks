import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect, useContext} from 'react';
import Options from "./Options";
import API_URL from "../url";
import {UserContext} from "../UserContext";
import getProducts from '../request/getProducts.js';
import styles from '../styles/MenuStyle';


export default function Menu(props) {
    const userData = useContext(UserContext);

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

            <Options navigation={props.navigation} data={product} token={userData.state.token}/>

        </View>
    );
}
