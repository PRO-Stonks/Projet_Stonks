import React, {useState} from "react";
import List from "../../../utils/list/List";
import Spinner from "../../../utils/Spinner";
import {Col, Container, Row} from 'react-bootstrap';
import LocationListElement from "./LocationListElement";
import ElementByLocationManager from "./ElementByLocationManager";


function LocationManager({token}) {
    const [selected, setSelected] = useState(null);

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

    return <Container fluid>
        <br/>
        <Row>
            <Col>
                <h2>Location selection</h2>
                <List token={token} item={LocationListElement} spinner={Spinner} url={"locations"}
                      onSelect={onSelectHandler} sort={sortElement}/>
            </Col>
            <Col>
                {selected && <ElementByLocationManager token={token} locationId={selected._id}/>}
            </Col>
        </Row>
    </Container>
        ;
};
export default LocationManager;