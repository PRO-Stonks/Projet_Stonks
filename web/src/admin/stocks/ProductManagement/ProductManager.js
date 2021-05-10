import React, {useState} from "react";
import List from "../../../utils/list/List";
import Spinner from "../../../utils/Spinner";
import {Col, Container, Row} from 'react-bootstrap';
import ProductListElement from "./ProductListElement";
import ElementByProductManager from "./ElementByProductManager";


function ProductManager({token}) {
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
                <List token={token} item={ProductListElement} spinner={Spinner} url={"products"}
                      onSelect={onSelectHandler} sort={sortElement}/>
            </Col>
            <Col>
                {selected && <ElementByProductManager token={token} productId={selected._id}/>}
            </Col>
        </Row>
    </Container>
        ;
};
export default ProductManager;