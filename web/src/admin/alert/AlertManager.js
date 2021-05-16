import React from "react";
import {Col, Container, Row} from 'react-bootstrap';
import AlertDisplay from "./AlertDisplay";
import List from "../../utils/list/List";
import Spinner from "../../utils/Spinner";
import AlertListProduct from "./AlertListProduct";


function AlertManager({token}) {

    function sortElement(a, b) {
        return a.role.localeCompare(b.role) || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    }

    return <Container fluid>
        <Row>
            <Col>
                <h2>Element alert</h2>
                <AlertDisplay token={token}/>
            </Col>
            <Col>
                <h2>Low Quantity threshold</h2>
                <List token={token} item={AlertListProduct} spinner={Spinner} url={"alerts/products/"}
                      sort={sortElement}/>
            </Col>
        </Row>
    </Container>
        ;
}

export default AlertManager;