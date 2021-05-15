import {Button, Col, Container, Row} from 'react-bootstrap';
import UserForm from "./UserForm";
import API_URL from "../../utils/URL";
import {useEffect, useState} from "react";

async function del(url, token) {
    try {
        return  fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url// body data type must match "Content-Type" header
        });
    } catch (e) {
        console.log(e);
    }
}


function UserManager({user, token, refreshHandler, formRefresh, deleteHandler}) {

    const softDelete = async () => {
        const res = await del(API_URL + "users/" + user._id, token);
        if (res.status !== 204) {
            res.json();
            if (res.status === "fail") {
                console.log(res.message);
            }
        } else {
            refreshHandler();
        }

    }

    const hardDelete = async () => {

        const res = await del(API_URL + "users/hardDel/" + user._id, token);
        console.log(res);
        if (res.status !== 204) {
            res.json();
            if (res.status === "fail") {
                console.log(res.message);
            }
        } else {
            console.log("Calling handler")
            deleteHandler();
        }
    }

    const [displayUpdateForm, setUpdate] = useState(false);
    useEffect(() => {
        if (displayUpdateForm) {
            setUpdate(false);
        }
    }, [user]);

    if (!user) {
        return <div>
            <h4>Add</h4>
            <UserForm
                userData={{firstName: "", lastName: "", email: "", password: "", role: "manager"}} action={"add"}
                token={token} refreshHandler={refreshHandler}/>
        </div>
    }

    return <Container fluid>
        <Row>
            <Col md={3} style={style}>Role</Col>
            <Col md={3} style={style}>Email</Col>
            <Col md={3} style={style}>First name</Col>
            <Col md={3} style={style}>Last name</Col>
        </Row>
        <Row>
            <Col md={3}>{user.role}</Col>
            <Col md={3}>{user.email}</Col>
            <Col md={3}>{user.firstName}</Col>
            <Col md={3}>{user.lastName}</Col>
        </Row>
        <br/>
        <Row>
            <Col>
                <Button variant="warning" onClick={softDelete}>Disable</Button>
            </Col>
            <Col>
                <Button variant="success" onClick={() => {
                    setUpdate(true)
                }}>Update</Button>
            </Col>
            <Col>
                <Button variant="danger" onClick={hardDelete}>Delete</Button>
            </Col>
        </Row>
        <br/>
        {displayUpdateForm ?
            <Row className="justify-content-md-center">
                <UserForm
                    userData={{
                        id: user._id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        role: user.role
                    }} action={"update"} token={token} refreshHandler={formRefresh}/>
            </Row>
            : ""
        }
    </Container>
}

export default UserManager;

const style = {"fontWeight": "bold", "borderBottom": "2px solid", "paddingBottom": "2px"}