import React, {useState} from "react";
import List from "../../utils/list/List";
import Spinner from "../../utils/Spinner";
import UserListElement from "./UserListElement";
import {Col, Container, Row} from 'react-bootstrap';
import UserManager from "./UserManager";


function UserManagementMenu(props) {
    const [selected, setSelected] = useState(null);
    const [refetchList, setRefreshList] = useState(false);

    const refresh = () => {
        setRefreshList(!refetchList);
    }

    const handleDelete = () => {
        console.log("In delete handler")
        setRefreshList(!refetchList);
        setSelected(null);
    }

    const refreshFrom = (data) => {
        refresh();
        setSelected(data);
    }

    function onSelectHandler(userSelected) {
        console.log("Selected")
        console.log(userSelected);
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
        return compareActive(a, b) || a.role.localeCompare(b.role) || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    }

    return (
        <Container fluid>
            <h2>User management</h2>
            <br/>
            <Row>
                <Col>
                    <List token={props.token} item={UserListElement} spinner={Spinner} url={"users"}
                          onSelect={onSelectHandler} sort={sortElement} refetch={refetchList}/>
                </Col>
                <Col>
                    <UserManager user={selected} token={props.token} refreshHandler={refresh} formRefresh={refreshFrom}
                                 deleteHandler={handleDelete}/>
                </Col>
            </Row>
        </Container>
    );
}
export default UserManagementMenu;