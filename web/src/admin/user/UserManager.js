import {Button, Col, Container, Row} from 'react-bootstrap';
import {useState} from "react";
import UserForm from "./UserForm";
import API_URL from "../../utils/URL";

async function del(url, token) {
    try {
        const response = await fetch(url, {
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
        return response.json();
    } catch (e) {
        console.log(e);
    }
}


function UserManager({user, token}) {
    const [modify, setModify] = useState(false);

    const softDelete = async () => {
        try {
            const res = await del(API_URL + "users/" + user._id, token);
            if (res.status === "fail") {
                console.log(res.message);
            }
        } catch (e) {

        }

    }

    const hardDelete = async () => {
        try {
            const res = await del(API_URL + "users/hardDel/" + user._id, token);
            if (res.status === "fail") {
                console.log(res.message);
            }
        } catch (e) {
                // Empty catch to
        }
    }

    if (!user) {
        return <UserForm
            userData={{firstName: "", lastName: "", email: "", password: "", role: "manager"}} action={"add"}
            token={token}/>
    }

    console.log(user)
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
            <Button onClick={() => setModify(prevState => (!prevState))}>Modify Me</Button>
            <Button variant="warning" onClick={softDelete}>Disable Me</Button>
            <Button variant="danger" onClick={hardDelete}>Delete Me</Button>
        </Row>
        <Row>
            <UserForm
                userData={{
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }} action={"update"} token={token}/>
        </Row>
    </Container>
};
export default UserManager;

const style = {"font-weight": "bold", "borderBottom": "2px solid", "padding-bottom": "2px"}