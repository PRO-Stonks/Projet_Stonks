import React, {useEffect, useState} from "react";
import API_URL from "../URL";

const NUMBER_OF_ELEMENT_PER_FETCH = 10;

/**
 * Paginated List
 * @param spinner An element to display while a fetch is occurring
 * @param url the part of the url to fetch (Composed as BASE_URL+ulr/?pages=
 * @param item the item to display in the list (the item will be given with props.item)
 * @param token the token to make a request
 * @param itemProps all remaing props will be given to the item
 * @returns {JSX.Element}
 * @constructor
 */
function List({spinner, url, item, token, sort, ...itemProps}) {
    const [page, setPage] = useState(0);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [nbFetchedElement, setNbFetchedElement] = useState(NUMBER_OF_ELEMENT_PER_FETCH);

    const fetchStories = (pageTarget) => {
        setIsLoading(true);
        fetch(getUrl(pageTarget), {
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
        })
            .then(response => {
                return response.json();
            })
            .then(result => {
                setIsLoading(false);
                if (result.status === "fail") {
                    setError(result.message);
                } else {
                    if (nbFetchedElement < NUMBER_OF_ELEMENT_PER_FETCH) {
                        setData(prevState => ([...prevState.slice(0, prevState.length - nbFetchedElement), ...result.data]));
                    } else {
                        setData(prevState => ([...prevState, ...result.data]));
                    }

                    if (result.results < NUMBER_OF_ELEMENT_PER_FETCH) {
                        setNbFetchedElement(result.results);
                    } else {
                        setPage(pageTarget);
                    }
                }
            });
    };

    const getUrl = (page) =>
        API_URL + url + `/?page=${page}`;

    useEffect(() => {
        const onInitialSearch = () => {
            fetchStories(1);
        }
        onInitialSearch();
    }, []);


    const onPaginatedSearch = () => {
        fetchStories(page + 1);
    }

    const Spinner = spinner;
    const Item = item;
    return (
        <div className="page">
            <div className="list">
                {sort ?
                    data.sort(sort).map(item => <Item key={item._id} item={item} {...itemProps} />) :
                    data.map(item => <Item key={item._id} item={item} {...itemProps} />)
                }
            </div>
            <div className="interactions">
                {!isLoading &&
                <button
                    type="button"
                    onClick={onPaginatedSearch}
                >
                    More
                </button>}
            </div>
            {error !== "" && <div>{error}</div>}
            {Spinner && <Spinner enable={isLoading}/>}
        </div>
    );
}

export default List;