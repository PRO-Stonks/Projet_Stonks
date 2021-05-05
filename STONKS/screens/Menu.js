import {Button, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import Options from "./Options";
import API_URL from "../url";
import {UserContext} from "../UserContext";
import getProducts from '../request/getProducts.js';
import styles from '../styles/MenuStyle';
import Scan from "./Scan";
import List from "../components/List";
import ItemListLocation from "../components/ItemListLocation";


export default function Menu(props) {
    // used to get user token
    const userData = useContext(UserContext);
    // state to store list of products
    const [product, setProduct] = useState([]);
    const [location, setLocation] = useState({});
    // to keep?
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);
    // state to check if we should scan
    const [isScan, setScan] = useState(false);


    React.useLayoutEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        console.log("Logout")
                        userData.setUserData({loggedIn: false, user: {}, token: ""});
                        props.navigation.navigate("Login");
                    }
                    }
                    title="Logout"
                    color="black"
                />

            )
        })
    })

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
    }, []);

    const renderLocation = ( {item} ) => {
        if (!item){
            throw DOMError;
        }
        return (
            <ItemListLocation
                item={item}
                onPress={() => setLocation(item)}
            />
        );
    };

    /**
     * Menu view
     */
    if (location._id) {
        return (
            isScan ? <Scan/> :
                <View style={styles.buttonsContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.titleText}>Options</Text>
                    </View>

                    <Options navigation={props.navigation} data={product} token={userData.state.token} location={location}/>
                </View>
        );
    } else {
        return <List token={userData.state.token} url="locations" renderItemHandler={renderLocation}/>
    }

}
