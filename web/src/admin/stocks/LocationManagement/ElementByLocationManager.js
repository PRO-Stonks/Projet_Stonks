import {useEffect, useState} from "react";
import API_URL from "../../../utils/URL";
import ElementListElement from "./ElementListElement";
import {groupBy} from "lodash";
import Spinner from "../../../utils/Spinner";

function ElementByLocationManager({locationId, token, ...props}) {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        const fetchStories = () => {

                fetch(API_URL + "elements/local/" + locationId, {
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
                            return element.idProduct._id;
                        }));
                    }
                }).catch(err => setError("an error occured"));
        }

            fetchStories();
        }, [locationId]
    );

    if (error) {
        return <div className="Error">{error}</div>;
    }
    if (isLoading) {
        return <Spinner enable={isLoading}/>
    }

    if (Object.keys(data).length > 0){
        return Object.keys(data).map(key => {
            return <div key={key}>
                <h2>{data[key][0].idProduct.name}</h2>
                {data[key].map(item => {
                    return <ElementListElement key={item._id} item={item}/>
                })} </div>
        });
    }else{
        return <h3>No element in this site</h3>
    }

}

export default ElementByLocationManager;