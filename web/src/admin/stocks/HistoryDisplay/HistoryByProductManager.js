import {useEffect, useState} from "react";
import API_URL from "../../../utils/URL";
import {groupBy} from "lodash";
import Spinner from "../../../utils/Spinner";
import {VictoryAxis, VictoryBar, VictoryChart, VictoryStack} from 'victory';

function HistoryByProductManager({productId, token, ...props}) {
    const [data, setData] = useState([]);
    const [rawData, setRawData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
            const fetchStories = () => {
                fetch(API_URL + "events/element/product/" + productId, {
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
                        setRawData(result.data);
                        setData(groupBy(result.data, function (element) {
                            return element.change;
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

    const nbCreated = data.Creation ? data.Creation.length : 0;
    const nbMoved = data.Move ? data.Move.length : 0;
    const nbRemoved = data.Remove ? data.Remove.length : 0;
    const dataWithDate = rawData.map(item => {
        item.time = new Date(item.time).setHours(0, 0, 0, 0);
        return item;
    });
    const dataToDisplay = groupBy(dataWithDate, function (item) {
        return item.change;
    });

    Object.keys(dataToDisplay).forEach(keys => {
        dataToDisplay[keys] = groupBy(dataToDisplay[keys], function (item) {
            return item.time;
        })
        Object.keys(dataToDisplay[keys]).forEach(item => {
            dataToDisplay[keys][item] = {value: dataToDisplay[keys][item].length, date: new Date(parseInt(item))}
        })
    })


    if (Object.keys(data).length > 0) {
        return <>
            <h3>Current quantity: {nbCreated - nbRemoved}</h3>
            <h3>Element added: {nbCreated}</h3>
            {data.Remove && <h3>Element removed: {nbRemoved}</h3>}
            {data.Move && <h3>Element moved: {nbMoved}</h3>}
            <VictoryChart>
                <VictoryAxis

                    tickFormat={(x) => new Date(x).toLocaleString('en-gb',
                        {year: 'numeric', month: 'numeric', day: 'numeric'})}
                />
                <VictoryStack>
                    {dataToDisplay.Creation && <VictoryBar
                        data={Object.values(dataToDisplay.Creation)}
                        x="date"
                        y="value"
                        style={{
                            data: {
                                fill: "#18ff00",
                                fillOpacity: 0.7,
                                strokeWidth: 3
                            },
                            labels: {
                                fontSize: 15,
                                fill: "#c43a31"
                            }
                        }}
                    /> }
                    { dataToDisplay.Remove && <VictoryBar
                        data={Object.values(dataToDisplay.Remove)}
                        x="date"
                        y="value"
                        style={{
                            data: {
                                fill: "#ff0000",
                                fillOpacity: 0.7,
                                strokeWidth: 3
                            },
                            labels: {
                                fontSize: 15,
                                fill: "#c43a31"
                            }
                        }}
                    />}
                    {dataToDisplay.Move && <VictoryBar
                        data={Object.values(dataToDisplay.Move)}
                        x="date"
                        y="value"
                        style={{
                            data: {
                                fill: "#ffbf00",
                                fillOpacity: 0.7,
                                strokeWidth: 3
                            },
                            labels: {
                                fontSize: 15,
                                fill: "#c43a31"
                            }
                        }}
                    />}
                </VictoryStack>
            </VictoryChart>
        </>
    } else {
        return <h3>No element for this product</h3>
    }
}

export default HistoryByProductManager;