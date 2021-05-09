import React from "react";
import List from "../../../utils/list/List";
import ProductListElement from "./ProductListElement";
import Spinner from "../../../Spinner";

function ProductFormGetAll(props) {

    return (
        <React.Fragment>
            <h3>Get all Products</h3>
            <List token={props.token} item={ProductListElement} spinner={Spinner} url={"products"}/>
        </React.Fragment>
    );
}

export default ProductFormGetAll;