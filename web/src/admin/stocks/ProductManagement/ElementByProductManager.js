import {useEffect, useState} from "react";
import API_URL from "../../../utils/URL";
import ElementListElement from "./ElementListElement";
import {groupBy} from "lodash";
import Spinner from "../../../utils/Spinner";

function ElementByProductManager({productId, token, ...props}) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchStories = () => {
                fetch(API_URL + "elements/product/" + productId, {
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
                        setData(groupBy(result.data, function (element) {
                            if(!element.idLocation){
                                console.log(element);
                            }

                            return element.idLocation._id;
                        }));
                    }
                }).catch(err => {
                    console.log(err)
                    setError("an error occured")
                });
        }

            fetchStories();
        }, [productId]
    );

    if (error) {
        return <div className="Error">{error}</div>;
    }
    if (isLoading) {
        return <Spinner enable={isLoading}/>
    }

    if (Object.keys(data).length > 0){
        return Object.keys(data).map(key => {
            console.log(key)
            return <div key={key}>
                <h2>{data[key][0].idLocation.name}</h2>
                {data[key].map(item => {
                    return <ElementListElement key={item._id} item={item}/>
                })} </div>
        });
    }else{
        return <h3>No element for this product</h3>
    }

};

export default ElementByProductManager;