import React, {useState} from "react";
import List from "../../../utils/list/List";
import Spinner from "../../../utils/Spinner";
import {Col, Container, Row} from 'react-bootstrap';
import LogListElement from "./LogListElement";
import UserListElement from "../../user/UserListElement";
import LogByUserManager from "./LogByUserManager";


function UserLogManager({token}) {
    const [selected, setSelected] = useState(null);

    function onSelectHandler(userSelected) {
        console.log("Selected")
        console.log(userSelected);
        if (selected) {
            setSelected(userSelected._id === selected._id ? null : userSelected);
        } else {
            setSelected(userSelected);
        }
    }

    function sortElement(a, b) {
        return a.role.localeCompare(b.role) || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    }

    return <Container fluid>
        <Row>
            <Col>
                <h2>User Connections</h2>
                <List token={token} item={LogListElement} spinner={Spinner} url={"events/connections/"}
                      queryOptions={"populateField=user&populateValue[user]=email&populateValue[user]=role&sort=-time"}/>

            </Col>
            <Col>
                <h2>Select user for more details</h2>
                <List token={token} item={UserListElement} spinner={Spinner} url={"users"}
                      onSelect={onSelectHandler} sort={sortElement}/>
            </Col>
            {selected != null && <Col>
                <LogByUserManager user={selected} token={token}/>
            </Col>}
        </Row>


    </Container>
        ;
}
export default UserLogManager;