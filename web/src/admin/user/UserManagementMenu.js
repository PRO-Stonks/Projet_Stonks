import React, {useState} from "react";
import List from "../../utils/list/List";
import Spinner from "../../Spinner";
import UserListElement from "./UserListElement";
import {Button, Col, Container, Row} from 'react-bootstrap';
import UserManager from "./UserManager";


function UserManagementMenu(props) {
    const [selected, setSelected] = useState(null);

    function onSelectHandler(userSelected) {
        console.log(userSelected);
        if (selected){
            setSelected(userSelected._id === selected._id ? null: selected);
        }else{
            setSelected(userSelected);
        }

    }

    function sortElement(a, b) {
        return a.role.localeCompare(b.role) || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <List token={props.token} item={UserListElement} spinner={Spinner} url={"users"}
                          onSelect={onSelectHandler} sort={sortElement}/>
                </Col>
                <Col>
                    {selected === null ?
                        <Button> Add user</Button> :
                        <UserManager user={selected}/>
                    }
                </Col>
            </Row>
        </Container>
    );
};
export default UserManagementMenu;