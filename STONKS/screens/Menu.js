import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect}from 'react';
import Options from "./Options";


async function getData(url, token){
    try{
        console.log(token)
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json();
    }catch (e){
        console.log("Error")
        console.log(e);
    }
}


export default function Menu(props) {
    console.log(props)
    const [product, setProduct] = useState([]);
    const [isFetchingProduct, setIsFetchingProduct] = useState(false);

    useEffect(() =>{
       async function fetchData(){
           const res = await getData('http://10.192.95.186:4000/api/v1/products', props.token);
           if(res.status === 'success'){
               console.log(res)
               console.log("Hello")
               setProduct(res.data)
           }else{
               throw res;
           }
       }
       fetchData().then(r => console.log(r)).catch(r => console.log(r));
        console.log("Hello")
    });

    return (
        <View style={styles.buttonsContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.titleText}>Options</Text>
            </View>

            <Options navigation={props.navigation}/>

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
