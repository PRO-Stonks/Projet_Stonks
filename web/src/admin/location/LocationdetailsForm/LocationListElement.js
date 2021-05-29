import React from "react";

function LocationListElement({item}) {
    if(item.active) {
        return <div className="container-fluid">
            <label className="form-check-label">id</label>
            <div className="form-control w-50">{item._id}</div>

            <label className="form-check-label">name</label>
            <div className="form-control w-50">{item.name}</div>

            <label className="form-check-label">address</label>
            <textarea
                className="form-control w-50 "
                name="address"
                value={item.address.street + " " + item.address.noStreet + "\n"
                + item.address.npa + " " + item.address.city + "\n" + item.address.country}
                disabled
            />
            <br/>
            <br/>
        </div>;
    } else {
        return "";
    }
}

export default LocationListElement;