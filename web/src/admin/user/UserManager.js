import {Button} from 'react-bootstrap';
import {useState} from "react";
function UserManager({user}) {
    const [modify, setModify] = useState(false);

    return <div className={"UserManager"}>
        {user.role} {user.email} {user.firstName} {user.lastName}
        <br/>
        <Button onClick={() => setModify(prevState => (!prevState))}>Modify Me</Button>
        <Button variant="warning" >Disable Me</Button>
        <Button variant="danger">Delete Me</Button>
        {modify &&
            <div>
                INSERT MODIFY FORM HERE
                <br/>
                <br/>
                <br/>
                <br/>
                <br/>
                <Button variant="success" >Apply</Button>
            </div>
        }
    </div>;
};
export default UserManager;