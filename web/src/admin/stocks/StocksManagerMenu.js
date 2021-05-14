import React, {useState} from "react";
import List from "../../utils/list/List";
import Spinner from "../../utils/Spinner";
import {Col, Container, Row, Tab, Tabs} from 'react-bootstrap';
import LocationListElement from "./LocationManagement/LocationListElement";
import ElementByLocationManager from "./LocationManagement/ElementByLocationManager";
import LocationManager from "./LocationManagement/LocationManager";
import ProductManager from "./ProductManagement/ProductManager";
import HistoryManager from "./HistoryDisplay/HistoryManager";


function StocksManagerMenu(props) {

    return <Tabs defaultActiveKey="history" id="StockManagerMenu">
        <Tab eventKey="product" title="Products">
            <ProductManager token={props.token}/>
        </Tab>
        <Tab eventKey="location" title="Location">
            <LocationManager token={props.token}/>
        </Tab>
        <Tab eventKey="history" title="History">
            <HistoryManager token={props.token}/>
        </Tab>
    </Tabs>
        ;
};
export default StocksManagerMenu;