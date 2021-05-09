import React from "react";

function LocationFormDelete(props){
    return (
        <React.Fragment>
            <h3>{props.title}</h3>
            <form className="form-group" onSubmit={props.handler.handleSubmit}>
                {props.listLocations ?
                    <>
                        {/* Name select */}
                        <select
                            className="custom-select w-50"
                            onChange={props.handleSelect}
                        >
                            <option selected>Select the name</option>
                            {props.listLocations.map((option, index) => (
                                <option key={index} value={index}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                        <br/>

                        {/* Display id and address according to selected name */}
                        {props.selectedLocation.id ?
                            <>
                                <br/>
                                <label className="form-check-label">id</label>
                                <div
                                    className="form-control w-50">{props.selectedLocation.id}</div>
                                <br/>
                                <label className="form-check-label">address</label>
                                <textarea
                                    className="form-control w-50 "
                                    name="address"
                                    value={props.selectedLocation.address.street + " " +
                                    props.selectedLocation.address.noStreet + "\n" +
                                    props.selectedLocation.address.npa + " " +
                                    props.selectedLocation.address.city + "\n" +
                                    props.selectedLocation.address.country}
                                    disabled
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
                <button className="btn-danger" type="submit">Submit</button>
            </form>
        </React.Fragment>
    );
}

export default LocationFormDelete;