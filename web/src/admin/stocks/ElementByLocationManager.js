import {useEffect, useState} from "react";
import LocationListElement from "./LocationListElement";
import Spinner from "../../utils/Spinner";
import List from "../../utils/list/List";
import ElementListElement from "./ElementListElement";

function ElementByLocationManager({locationId, token, ...props}) {
    const [selected, setSelected] = useState(null);
    const [refetchList, setRefreshList] = useState(false);

    function onSelectHandler(userSelected) {
        if (selected) {
            setSelected(userSelected._id === selected._id ? null : userSelected);
        } else {
            setSelected(userSelected);
        }
    }

    function sortElement(a, b) {
        return a.idProduct.name.localeCompare(b.idProduct.name) ||  new Date(a.entryDate) - new Date(b.entryDate);
    }


    return <List token={token} item={ElementListElement} spinner={Spinner} url={"elements/local/"+locationId}
                 onSelect={onSelectHandler} refetch={refetchList} sort={sortElement}/>
}

export default ElementByLocationManager;