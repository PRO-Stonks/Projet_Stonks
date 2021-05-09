import React from "react";
import List from "../../../utils/list/List";
import LocationListElement from "./LocationListElement";
import Spinner from "../../../utils/Spinner";

function ProductFormGetAll(props) {

    return (
        <React.Fragment>
            <h3>Get all Locations</h3>
            <List token={props.token} item={LocationListElement} spinner={Spinner} url={"locations"}/>
        </React.Fragment>
    );
}

export default ProductFormGetAll;