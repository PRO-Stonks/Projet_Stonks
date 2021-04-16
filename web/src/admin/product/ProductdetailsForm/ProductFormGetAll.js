import React from "react";

function ProductFormGetAll(props) {

    return (
        <React.Fragment>
            <h3>Get all Products</h3>
            <form onSubmit={props.handler.handleSubmit}>
                {/* Display error if submit failed */}
                {props.handler.errors.submit ?
                    <div className="Error">{props.handler.errors.submit}</div> : <br/>}

                {/* Submit button */}
                <button className="btn-success" type="submit">Submit</button>
            </form>
        </React.Fragment>
    );
}

export default ProductFormGetAll;