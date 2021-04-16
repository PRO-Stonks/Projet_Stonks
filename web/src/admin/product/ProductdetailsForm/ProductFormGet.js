import React from "react";

function ProductFormGet(props){
    return (
        <React.Fragment>
            <h3>Get a Product</h3>
            <form className="form-group">
                {props.listProducts ?
                    <>
                        {/* Name select */}
                        <select
                            className="custom-select w-50"
                            onChange={props.handleSelect}
                        >
                            <option selected>Select the name</option>
                            {props.listProducts.map((option, index) => (
                                <option key={index} value={index}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <br/><br/>

                        {/* Display id and tag according to selected name */}
                        {props.selectedProduct.id ?
                            <>
                                <label className="form-check-label">id</label>
                                <div
                                    className="form-control w-50">{props.selectedProduct.id}</div>
                                <br/>
                                <label className="form-check-label">Tag</label>
                                <textarea
                                    className="form-control w-50 "
                                    name="tag"
                                    value={props.selectedProduct.tag}
                                    disabled
                                />
                            </>
                            : ""}
                    </>
                    : <error>
                        {/* If Products could not be fetched */}
                        Could not fetch data
                    </error>}
            </form>
        </React.Fragment>
    );
}

export default ProductFormGet;