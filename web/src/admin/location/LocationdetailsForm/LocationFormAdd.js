import React from "react";

function LocationFormAdd(props){
    return (
        <div className="">
            <h3>Add a Location</h3>
            <form className="form-group" onSubmit={props.handler.handleSubmit}>
                {/* Name Input */}
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

                {/* Street Input */}
                <input
                    className="form-control w-50 "
                    placeholder="Street"
                    id="add_street"
                    name="street"
                    type="text"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.street}
                />
                <br/>

                {/* noStreet Input */}
                <input
                    className="form-control w-50 "
                    placeholder="Street number"
                    id="add_noStreet"
                    name="noStreet"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.noStreet}
                />
                <br/>

                {/* npa Input */}
                <input
                    className="form-control w-50 "
                    placeholder="NPA"
                    id="add_npa"
                    name="npa"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.npa}
                />
                <br/>

                {/* city Input */}
                <input
                    className="form-control w-50 "
                    placeholder="City"
                    id="add_city"
                    name="city"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.city}
                />
                <br/>

                {/* country Input */}
                <input
                    className="form-control w-50 "
                    placeholder="Country"
                    id="add_country"
                    name="country"
                    onChange={props.handler.handleChange}
                    onBlur={props.handler.handleBlur}
                    value={props.handler.values.country}
                />

                {/* Display error if submit failed */}
                {props.handler.errors.submit ?
                    <div className="Error">{props.handler.errors.submit}</div> : <br/>}

                {/* Submit button */}
                <button className="btn-success" type="submit">Submit</button>
            </form>
        </div>
    );
}

export default LocationFormAdd;