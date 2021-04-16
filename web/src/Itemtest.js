

import React from "react";

function ItemTest(props) {
    console.log("PROPS");
    console.log(props);
    return <a key={props.item._id}> {props.item.code}</a>;
}

export default ItemTest;