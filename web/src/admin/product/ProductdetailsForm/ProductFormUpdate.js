import React from "react";

function ProductFormUpdate(props) {

    return (
        <React.Fragment>
            <h3>Update a Product</h3>
            <form className="form-group" onSubmit={props.handler.handleSubmit}>
                {props.listProducts ?
                    <>
                        {/* Id select */}
                        <select
                            className="custom-select w-50"
                            onChange={props.handleSelect}
                        >
                            <option selected>Select the id</option>
                            {props.listProducts.map((option, index) => (
                                <option key={index} value={index}>
                                    {option._id}
                                </option>
                            ))}
                        </select>
                        <br/><br/>

                        {/* Display id and tag according to selected name */}
                        {props.selectedProduct.id ?
                            <>
                                {/* Name Input */}
                                <label className="form-check-label">Name</label>
                                <input
                                    className="form-control w-50"
                                    id="add_name"
                                    name="name"
                                    type="text"
                                    onChange={props.handler.handleChange}
                                    onBlur={props.handler.handleBlur}

                                    value={
                                        /* With this, we give the original name to update */
                                        props.handler.values.name === "\o" ?
                                            props.selectedProduct.name : props.handler.values.name}
                                />
                                <br/>

                                {/* Tag Input */}
                                <label className="form-check-label">Tag</label>
                                <textarea
                                    className="form-control w-50 "
                                    id="add_tag"
                                    name="tag"
                                    onChange={props.handler.handleChange}
                                    onBlur={props.handler.handleBlur}
                                    value={
                                        /* With this, we give the original tag to update */
                                        props.handler.values.tag === props.baseHandlerValue ?
                                            props.selectedProduct.tag : props.handler.values.tag}
                                />
                            </>
                            : ""}
                    </>
                    : <error>
                        {/* If Products could not be fetched */}
                        Could not fetch data
                    </error>}

                {/* Display error if submit failed */}
                {props.handler.errors.submit ?
                    <div className="Error">{props.handler.errors.submit}</div> : <br/>}

                {/* Submit button */}
                <button className="btn-success" type="submit">Submit</button>
            </form>
        </React.Fragment>
    );

}

export default ProductFormUpdate;