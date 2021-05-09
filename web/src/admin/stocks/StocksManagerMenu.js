import React, {useState} from "react";
import List from "../../utils/list/List";
import Spinner from "../../utils/Spinner";
import {Col, Container, Row, Tabs, Tab} from 'react-bootstrap';


function StocksManagerMenu(props) {

    return <Tabs defaultActiveKey="product" id="StockManagerMenu">
        <Tab eventKey="product" title="Products">
            Here you can select a product to see details about it's element
        </Tab>
        <Tab eventKey="location" title="Location">
           Here you can see element by location
        </Tab>
    </Tabs>;
};
export default StocksManagerMenu;