import React, {useEffect, useState} from "react";

function LocationFormUpdate(props) {

    /* Init values only once */
    const [init, setInit] = useState(false);
    useEffect(() => {
        props.handler.values.name = props.selectedLocation.name;
        props.handler.values.street = props.selectedLocation.address.street;
        props.handler.values.noStreet = props.selectedLocation.address.noStreet;
        props.handler.values.npa = props.selectedLocation.address.npa;
        props.handler.values.city = props.selectedLocation.address.city;
        props.handler.values.country = props.selectedLocation.address.country;
        setInit(!init);
    }, [props.selectedLocation]);

    return (
        <React.Fragment>
            <h3>Update a Location</h3>
            <form className="form-group" onSubmit={props.handler.handleSubmit}>
                {props.listLocations ?
                    <>
                        {/* Id select */}
                        <select
                            className="custom-select w-50"
                            onChange={props.handleSelect}
                        >
                            <option selected>Select the id</option>
                            {props.listLocations.map((option, index) => {
                                if (option.active) {
                                    return <option key={index} value={index}>
                                        {option._id}
                                    </option>;
                                } else {
                                    return "";
                                }
                            })}
                        </select>
                        <br/><br/>

                        {/* Display id and tag according to selected name */}
                        {props.selectedLocation.id ?
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
                                    value={props.handler.values.name}
                                />
                                <br/>

                                {/* Street Input */}
                                <label className="form-check-label">Street</label>
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

                                {/* noStreet Input */}
                                <label className="form-check-label">Street number</label>
                                <input
                                    className="form-control w-50 "
                                    placeholder="Street number"
                                    id="add_noStreet"
                                    name="noStreet"
                                    onChange={props.handler.handleChange}
                                    onBlur={props.handler.handleBlur}
                                    value={props.handler.values.noStreet}
                                />

                                {/* npa Input */}
                                <label className="form-check-label">NPA</label>
                                <input
                                    className="form-control w-50 "
                                    placeholder="NPA"
                                    id="add_npa"
                                    name="npa"
                                    onChange={props.handler.handleChange}
                                    onBlur={props.handler.handleBlur}
                                    value={props.handler.values.npa}
                                />

                                {/* city Input */}
                                <label className="form-check-label">City</label>
                                <input
                                    className="form-control w-50 "
                                    placeholder="City"
                                    id="add_city"
                                    name="city"
                                    onChange={props.handler.handleChange}
                                    onBlur={props.handler.handleBlur}
                                    value={props.handler.values.city}
                                />

                                {/* country Input */}
                                <label className="form-check-label">Country</label>
                                <input
                                    className="form-control w-50 "
                                    placeholder="Country"
                                    id="add_country"
                                    name="country"
                                    onChange={props.handler.handleChange}
                                    onBlur={props.handler.handleBlur}
                                    value={props.handler.values.country}
                                />
                            </>
                            : ""}
                    </>
                    : <error>
                        {/* If Locations could not be fetched */}
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

export default LocationFormUpdate;