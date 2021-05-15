import React from "react";
import List from "../../utils/list/List";
import AlertListElement from "./AlertListElement";


function AlertManager(props) {

    return <div className="AlertManager">
        <em>Element are close to their limit date</em>
        <List token={props.token} url={"alerts/elements"} item={AlertListElement} queryOptions=""/>
    </div>;
}

export default AlertManager;