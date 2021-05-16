import React from "react";

function ProductFormAdd(props){
    return (
        <div className="">
            <h3>Add a Product</h3>
            <form className="form-group" onSubmit={props.handler.handleSubmit}>
                {/* Name Input */}
                <label className="form-check-label">Name</label>
                <input
                    className="form-control w-50"
                    placeholder="Name"
                    id="add_name"
                    name="name"
                    type="text"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.name}
                />
                <br/>
                <label className="form-check-label">Tag</label>
                {/* Tag Input */}
                <textarea
                    className="form-control w-50 "
                    placeholder="Tag"
                    id="add_tag"
                    name="tag"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.tag}
                />
                <br/>
                <label className="form-check-label">Low Quantity Threshold</label>
                <input
                    className="form-control w-50"
                    placeholder="Low quantity threshold"
                    id="add_lowQuantity"
                    name="lowQuantity"
                    type="number"
                    min="0"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.lowQuantity}
                />
                <br/>

                {/* Display error if submit failed */}
                {props.handler.errors.submit ?
                    <div className="Error">{props.handler.errors.submit}</div> : <br/>}

                {/* Submit button */}
                <button className="btn-success" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default ProductFormAdd;