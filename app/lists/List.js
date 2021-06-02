import React, {useEffect, useState} from "react";
import {Dimensions, FlatList, StatusBar, StyleSheet, Text} from 'react-native';
import NUMBER_OF_ELEMENT_PER_FETCH from "../utils/getNumberOfElementPerFetch";
import API_URL from "../utils/url";
import {SafeAreaView} from "react-navigation";


function List({token, renderItemHandler, url, ...props}) {
    const [data, setData] = useState([]);
    const [loading, setIsLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [error, setError] = useState("");
    const [nbFetchedElement, setNbFetchedElement] = useState(NUMBER_OF_ELEMENT_PER_FETCH);

    const getUrl = (page) =>
        API_URL + url + `/?page=${page}`;

    const fetchStories = (pageTarget, limit = 10) => {
        setIsLoading(true);
        fetch(getUrl(pageTarget) + '&limit=' + limit, {
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
            //body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(response => {
            return response.json();
        }).then(result => {
            setIsLoading(false);
            if (result.status === "fail") {
                setError(result.message);
            } else {
                if (nbFetchedElement < NUMBER_OF_ELEMENT_PER_FETCH) {
                    setData(prevState => ([...prevState.slice(0, prevState.length - nbFetchedElement), ...result.data]));
                } else {
                    setData(prevState => ([...prevState, ...result.data]));
                }
                console.log(result.data);
                if (result.results < NUMBER_OF_ELEMENT_PER_FETCH) {
                    setNbFetchedElement(result.results);
                } else {
                    setPage(pageTarget);
                }
            }
        }).catch(err => console.log(err));
    };

    useEffect(() => {
        const onInitialSearch = () => {
            fetchStories(1);
        }
        onInitialSearch();
    }, []);


    const onPaginatedSearch = () => {
        fetchStories(page + 1);
    }
    return <SafeAreaView style={styles.container}>
        {error.length > 0 && <Text>{error}</Text>}
        <FlatList
            data={data}
            keyExtractor={(item) => item._id}
            onEndReached={onPaginatedSearch}
            onEndReachedThreshold={0.5}
            renderItem={renderItemHandler}
        />
    </SafeAreaView>
}

const styles = StyleSheet.create({
    container: {
        minHeight: Dimensions.get('window').height,
        flex: 1,
        marginTop: StatusBar.currentHeight || 0,
    },
});

export default List;
