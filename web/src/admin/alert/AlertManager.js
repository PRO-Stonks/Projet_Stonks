import React from "react";
import {Col, Container, Row} from 'react-bootstrap';
import AlertDisplay from "./AlertDisplay";
import AlertProductDisplay from "./AlertProductDisplay";


function AlertManager({token}) {


    return <Container fluid>
        <Row>
            <Col>
                <h2>Element alert</h2>
                <AlertDisplay token={token}/>
            </Col>
            <Col>
                <AlertProductDisplay token={token}/>
            </Col>
        </Row>
    </Container>
        ;
}

export default AlertManager;