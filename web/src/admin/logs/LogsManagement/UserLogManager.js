import React from "react";
import List from "../../../utils/list/List";
import Spinner from "../../../utils/Spinner";
import {Container} from 'react-bootstrap';
import LogListElement from "./LogListElement";


function UserLogManager({token}) {

    return <Container fluid>

        <h2>User Connections</h2>
        <List token={token} item={LogListElement} spinner={Spinner} url={"events/connections/"}
                 queryOptions={"populateField=user&populateValue[user]=email&populateValue[user]=role&sort=-time"}/>

    </Container>
        ;
};
export default UserLogManager;