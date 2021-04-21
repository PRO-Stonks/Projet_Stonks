import React from "react";
import List from "../../utils/list/List";
import Spinner from "../../Spinner";
import UserListElement from "./UserListElement";


function UserManagementMenu(props) {

    function onSelectHandler(e){
        console.log(e)
    }

    function sortElement(a,b){
        return a.role.localeCompare(b.role) || a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName);
    }

    return (
        <div>
            <List token={props.token} item={UserListElement} spinner={Spinner} url={"users"} onSelect={onSelectHandler} sort={sortElement}/>
        </div>
    );
};
export default UserManagementMenu;