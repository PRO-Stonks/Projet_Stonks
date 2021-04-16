

import React from "react";

function ItemTest(props) {
    console.log("PROPS");
    console.log(props);

    return <p key={props.item._id}> {props.item[props.select]}</p>;
}

export default ItemTest;