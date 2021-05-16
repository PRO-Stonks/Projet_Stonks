import React from "react";

function ProductFormDelete(props){
    return (
        <React.Fragment>
            <h3>{props.title}</h3>
            <form className="form-group" onSubmit={props.handler.handleSubmit}>
                {props.listProducts ?
                    <>
                        {/* Name select */}
                        <select
                            className="custom-select w-50"
                            onChange={props.handleSelect}
                        >
                            <option selected>Select the name</option>
                            {props.listProducts.map((option, index) => {
                                if (props.filter && !option.active) {
                                    return "";
                                } else {
                                    return <option key={index} value={index}>
                                        {option.name}
                                    </option>
                                }
                            })}
                        </select>
                        <br/>

                        {/* Display id and tag according to selected name */}
                        {props.selectedProduct.id ?
                            <>
                                <br/>
                                <label className="form-check-label">id</label>
                                <div
                                    className="form-control w-50">{props.selectedProduct.id}</div>
                                <br/>
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
                <button className="btn-danger" type="submit">Submit</button>
            </form>
        </React.Fragment>
    );
}

export default ProductFormDelete;