import React from "react";
import List from "../../utils/list/List";
import AlertListProduct from "./AlertListProduct";
import Spinner from "../../utils/Spinner";


function AlertProductDisplay({token}) {

    return <div className="AlertManagerProduct">
        <h2>Low Quantity threshold</h2>
        <List token={token} item={AlertListProduct} spinner={Spinner} url={"alerts/products/"}
              queryOptions={"populateField=idProduct&populateValue[idProduct]=name&populateValue[idProduct]=lowQuantity"}
        />
    </div>;
}

export default AlertProductDisplay;