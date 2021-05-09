import {isInteger, useFormik} from "formik";
import LocationManagement from "./LocationManagement";
import React, {useEffect, useState} from "react";
import {
    Step,
    StepLabel,
    Stepper
} from '@material-ui/core';
import ActionsForm from "../../utils/ActionsForm";
import LocationFormAdd from "./LocationdetailsForm/LocationFormAdd";
import LocationFormGetAll from "./LocationdetailsForm/LocationFormGetAll";
import LocationFormUpdate from "./LocationdetailsForm/LocationFormUpdate";
import LocationFormDelete from "./LocationdetailsForm/LocationFormDelete";

function Location(props) {

    const management = new LocationManagement();

    /* Formik handlers */
    const handlers = {
        add: useFormik({
            initialValues: {
                name: '',
                street: '',
                noStreet: '',
                npa: '',
                city: '',
                country: ''
            },
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.add(props.token, {
                    name: values.name,
                    address: {
                        street: values.street,
                        noStreet: values.noStreet,
                        npa: values.npa,
                        city: values.city,
                        country: values.country
                    }
                });

                /* Display Location Name */
                if (res.status === "success") {
                    console.log("Location added");
                    alert("The location: " + JSON.stringify(res.data.name) + " has correctly been added");
                }
                /* Display message error */
                else {
                    handlers.add.errors.submit = res.message;
                }
            }
        }),

        get: useFormik({
            initialValues: {
                id: ''
            },
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.get(props.token, values.id);

                /* Display Location data */
                if (res.status === "success") {
                    console.log("Location got");
                    alert("Location requested:\n" + JSON.stringify(res.data));
                }
                /* Display message error */
                else {
                    handlers.get.errors.submit = res.message;
                }
            }
        }),

        getAll: useFormik({
            initialValues: {
                queryString: ''
            },
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.getAll(props.token, values.queryString);

                /* Display Locations data */
                if (res.status === "success") {
                    console.log("All Locations got");
                    alert("All locations:\n" + JSON.stringify(res.data));
                }
                /* Display message error */
                else {
                    handlers.getAll.errors.submit = res.message;
                }
            }
        }),

        update: useFormik({
            initialValues: {
                name: '',
                street: '',
                noStreet: '',
                npa: '',
                city: '',
                country: ''
            },
            onSubmit: async (values) => {

                /* Send http request and get response */
                const res = await management.update(props.token, selectedLocation.id, {
                    name: values.name,
                    address: {
                        street: values.street,
                        noStreet: values.noStreet,
                        npa: values.npa,
                        city: values.city,
                        country: values.country
                    }
                });

                /* Display updated Location */
                if (res.status === "success") {
                    console.log("Location updated");
                    alert("This is the updated location:\n" + JSON.stringify(res.data) + "\nPlease reload the page" +
                        " to see the changes.");
                }
                /* Display message error */
                else {
                    handlers.update.errors.submit = res.message;
                }
            }
        }),

        sofDelete: useFormik({
            initialValues: {},
            onSubmit: async (values) => {

                /* Send http request and get response */
                const res = await management.softDelete(props.token, selectedLocation.id);

                /* Display soft deleted message */
                if (res.status === "success") {
                    console.log("Location soft deleted");
                    alert("The location was soft deleted but still can be seen.");
                }
                /* Display message error */
                else {
                    handlers.sofDelete.errors.submit = res.message;
                }
            }
        }),

        delete: useFormik({
            initialValues: {},
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.delete(props.token, selectedLocation.id);

                /* Display deleted message */
                if (res.status === "success") {
                    console.log("Location soft deleted");
                    alert("The location was deleted, please refresh the page.");
                }
                /* Display message error */
                else {
                    handlers.sofDelete.errors.submit = res.message;
                }
            }
        })

    }

    /* Fetch only once */
    const [data, setFetching] = useState({fetching: false, data: ""});
    useEffect(() => {
        async function fetchAll() {
            return await management.getAll(props.token, "");
        }

        if (data.fetching) {
            fetchAll().then(res => {
                setFetching({data: res.data, fetching: data.fetching})
            });
        }
    }, [data.fetching]);


    /* Location selection management */
    const handleSelect = (event) => {
        let index = event.target.value;
        if (isInteger(index)) {
            setGetSelection({id: data.data[index]._id, name: data.data[index].name, address: data.data[index].address});
        } else {
            setGetSelection({id: "", name: "", address: {street: "", noStreet: "", npa: "", city: "", country: ""}});
        }
    };
    const [selectedLocation, setGetSelection] = useState({
        id: "",
        name: "",
        address: {street: "", noStreet: "", npa: "", city: "", country: ""}
    });


    /**
     * Select the form depending on the action
     *
     * @param action
     * @returns {JSX.Element}
     */
    function renderFormContent(action) {
        switch (action) {
            case "add":
                return <LocationFormAdd handler={handlers.add}/>

            case "get all":
                return <LocationFormGetAll token={props.token}/>

            case "update":
                /* Start by getting all locations */
                if (!data.fetching) {
                    data.fetching = true;
                }

                return <LocationFormUpdate handler={handlers.update}
                                           handleSelect={handleSelect}
                                           listLocations={data.data}
                                           selectedLocation={selectedLocation}/>;

            case "softDelete":
                /* Start by getting all locations */
                if (!data.fetching) {
                    data.fetching = true;
                }

                return <LocationFormDelete title="Soft delete a Location"
                                           handler={handlers.sofDelete}
                                           handleSelect={handleSelect}
                                           listLocations={data.data}
                                           selectedLocation={selectedLocation}/>;

            case "delete":
                /* Start by getting all locations */
                if (!data.fetching) {
                    data.fetching = true;
                }

                return <LocationFormDelete title="Delete a Location"
                                           handler={handlers.delete}
                                           handleSelect={handleSelect}
                                           listLocations={data.data}
                                           selectedLocation={selectedLocation}/>;

            default:
                return <div className="Error">Selected action not Found</div>;
        }
    }

    /* Stepper management */
    const steps = ['Action', 'Details'];
    const [activeStep, setActiveStep] = useState(0);

    /* Actions management */
    const [action, setAction] = React.useState('none');

    return (
        <React.Fragment>
            <div className="container">
                <h2>Location management</h2>

                {/* Stepper */}
                <Stepper className="container bg-dark" activeStep={activeStep}>
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                <br/>

                {/* Actions form or details form */}
                {activeStep ?
                    <center>
                        {
                            renderFormContent(action)
                        }

                        <br/>
                        <div>
                            {/* Back button */}
                            <button
                                className={"btn-secondary"}
                                onClick={() => {
                                    data.fetching = false;
                                    setGetSelection({
                                        id: "",
                                        name: "",
                                        address: {street: "", noStreet: "", npa: "", city: "", country: ""}
                                    })
                                    setActiveStep(activeStep - 1);
                                }}>
                                BACK
                            </button>
                        </div>
                    </center>
                    :
                    <center>
                        {/* Action Form */}
                        <ActionsForm action={action} setAction={setAction}/>
                        <br/>

                        {/* Next button */}
                        <button
                            hidden={action === "none"}
                            className={"btn-secondary"}
                            onClick={() => {
                                setActiveStep(activeStep + 1)
                            }}>
                            NEXT
                        </button>
                    </center>
                }
            </div>
        </React.Fragment>
    );
}

export default Location;