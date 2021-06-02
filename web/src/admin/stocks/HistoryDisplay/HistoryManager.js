import React, {useState} from "react";
import List from "../../../utils/list/List";
import Spinner from "../../../utils/Spinner";
import {Col, Container, Row} from 'react-bootstrap';
import ProductListElement from "./ProductListElement";
import HistoryByProductManager from "./HistoryByProductManager";


function HistoryManager({token}) {
    const [selected, setSelected] = useState(null);

    function onSelectHandler(userSelected) {
        if (selected) {
            setSelected(userSelected._id === selected._id ? null : userSelected);
        } else {
            setSelected(userSelected);
        }
    }

    function compareActive(a, b) {
        if (a.active && !b.active) {
            return -1;
        } else if (!a.active && b.active) {
            return 1;
        } else {
            return 0;
        }
    }

    function sortElement(a, b) {
        return compareActive(a, b) || a.name.localeCompare(b.name);
    }

    return <Container fluid>
        <br/>
        <Row>
            <Col>
                <h2>Products Selection</h2>
                <List token={token} item={ProductListElement} spinner={Spinner} url={"products"}
                      onSelect={onSelectHandler} sort={sortElement}/>
            </Col>
            <Col>
                {selected && <HistoryByProductManager token={token} productId={selected._id}/>}
            </Col>
        </Row>
    </Container>
        ;
}
export default HistoryManager;