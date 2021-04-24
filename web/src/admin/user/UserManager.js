import {Button, Col, Container, Row} from 'react-bootstrap';
import {useState} from "react";
import UserForm from "./UserForm";

function UserManager({user , token}) {
    const [modify, setModify] = useState(false);

    if(!user){
        return <UserForm
            userData={{firstName: "", lastName: "", email: "", password: "", role: "manager"}} action={"add"} token={token}/>
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
                <Button variant="warning">Disable Me</Button>
                <Button variant="danger">Delete Me</Button>
                {modify &&
                <div>
                    INSERT MODIFY FORM HERE

                    <Button variant="success">Apply</Button>
                </div>
                }
            </Row>
        <Row>
            <UserForm
                userData={{id:user._id,  firstName: user.firstName, lastName: user.lastName, email: user.email, role:user.role}} action={"update"} token={token}/>
        </Row>
        </Container>
};
export default UserManager;

const style = {"font-weight": "bold", "borderBottom": "2px solid", "padding-bottom": "2px"}