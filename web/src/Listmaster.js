import React, {useEffect, useState} from "react";
import API_URL from "./URL";

const applyUpdateResult = (result) => (prevState) => ({
    data: [...prevState.data, ...result.data],
    page: result.page,
    isLoading: false,
});

const applySetResult = (result) => (prevState) => ({
    data: result.data,
    page: result.page,
    isLoading: false,
});





function ListMaster(props) {
    const [state, setState] = useState({page: null, data: [], isLoading: false});
    const onInitialSearch = () => {
        fetchStories(1);
    }

    const getUrl = (page) =>
        API_URL + props.url+`/?page=${page}`;

    useEffect(() => {
        onInitialSearch();
    }, []);

    const fetchStories = (page) => {
        setState({...state, isLoading: true})
        fetch(getUrl(page), {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            //body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
            .then(response => {
                return response.json();
            })
            .then(result => {
                console.log(result.data);
                console.log(page);
                onSetResult(result, page)
            })
    };

    const onSetResult = (result, page) => {
        result.page = page
        page === 0
            ? setState(applySetResult(result))
            : setState(applyUpdateResult(result));
    }

    const onPaginatedSearch = (e) => {
        fetchStories(state.page + 1);
    }

    const Spinner = props.spinner;
    const Item = props.item;
    return (
        <div className="page">
            <div className="list">
                {state.data.map(item => <Item item={item}/>)}
            </div>
            <div className="interactions">
                {
                    (state.page !== null && !state.isLoading) &&
                    <button
                        type="button"
                        onClick={onPaginatedSearch}
                    >
                        More
                    </button>
                }
            </div>
            {Spinner && <Spinner enable={state.isLoading}/>}

        </div>
    );
}

export default ListMaster;