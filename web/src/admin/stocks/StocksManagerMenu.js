import React, {useState} from "react";
import List from "../../utils/list/List";
import Spinner from "../../utils/Spinner";
import {Col, Container, Row, Tab, Tabs} from 'react-bootstrap';
import LocationListElement from "./LocationManagement/LocationListElement";
import ElementByLocationManager from "./LocationManagement/ElementByLocationManager";


function StocksManagerMenu(props) {
    const [selected, setSelected] = useState(null);
    const [refetchList, setRefreshList] = useState(false);

    function onSelectHandler(userSelected) {
        if (selected) {
            setSelected(userSelected._id === selected._id ? null : userSelected);
        } else {
            setSelected(userSelected);
        }
    }

    function sortElement(a, b) {
        return a.name.localeCompare(b.name);
    }

    return <Tabs defaultActiveKey="location" id="StockManagerMenu">
        <Tab eventKey="product" title="Products">
            Here you can select a product to see details about it's element
        </Tab>
        {/* TODO get into it's own Component*/}
        <Tab eventKey="location" title="Location">
            <Container fluid>
                <br/>
                <Row>
                    <Col>
                        <h2>Location selection</h2>
                        <List token={props.token} item={LocationListElement} spinner={Spinner} url={"locations"}
                              onSelect={onSelectHandler} sort={sortElement} refetch={refetchList}/>
                    </Col>
                    <Col>
                        {selected && <ElementByLocationManager token={props.token} locationId={selected._id}/>}
                    </Col>
                </Row>
            </Container>
        </Tab>
    </Tabs>
        ;
};
export default StocksManagerMenu;