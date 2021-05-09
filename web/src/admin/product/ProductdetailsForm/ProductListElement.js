import React from "react";
import {Col, Row} from "react-bootstrap";

function ProductListElement({item}) {
    return <div className="container-fluid">
        <label className="form-check-label">id</label>
        <div
            className="form-control w-50">{item._id}</div>
        <label className="form-check-label">name</label>
        <div
            className="form-control w-50">{item.name}</div>
        <label className="form-check-label">tag</label>
        <textarea
            className="form-control w-50 "
            name="tag"
            value={item.tag}
            disabled
        />
        <br/>
        <br/>
    </div>;
}

export default ProductListElement;