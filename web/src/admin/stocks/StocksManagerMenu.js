import React from "react";
import {Tab, Tabs} from 'react-bootstrap';
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
}
export default StocksManagerMenu;