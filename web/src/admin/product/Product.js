import {isInteger, useFormik} from "formik";
import ProductManagement from "./ProductManagement";
import React, {useEffect, useState} from "react";
import {
    Step,
    StepLabel,
    Stepper
} from '@material-ui/core';
import ActionsForm from "./ActionsForm";
import ProductFormAdd from "./ProductdetailsForm/ProductFormAdd";
import ProductFormGet from "./ProductdetailsForm/ProductFormGet";
import ProductFormGetAll from "./ProductdetailsForm/ProductFormGetAll";
import ProductFormUpdate from "./ProductdetailsForm/ProductFormUpdate";
import ProductFormDelete from "./ProductdetailsForm/ProductFormDelete";
import UserListElement from "../user/UserListElement";
import Spinner from "../../Spinner";
import List from "../../utils/list/List";
import ProductListElement from "./ProductdetailsForm/ProductListElement";

function Product(props) {

    const management = new ProductManagement();

    /* Formik handlers */
    const handlers = {
        add: useFormik({
            initialValues: {
                name: '',
                tag: ''
            },
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.add(props.token, values);

                /* Display Product Name */
                if (res.status === "success") {
                    console.log("Product added");
                    alert("The product: " + JSON.stringify(res.data.name) + " has correctly been added");
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

                /* Display Product data */
                if (res.status === "success") {
                    console.log("Product got");
                    alert("Product requested:\n" + JSON.stringify(res.data));
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

                /* Display Products data */
                if (res.status === "success") {
                    console.log("All Products got");
                    alert("All products:\n" + JSON.stringify(res.data));
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
                tag: ''
            },
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.update(props.token, selectedProduct.id, {
                    name: values.name,
                    tag: values.tag
                });

                /* Display updated Product */
                if (res.status === "success") {
                    console.log("Product updated");
                    alert("This is the updated product:\n" + JSON.stringify(res.data) + "\nPlease reload the page" +
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
                const res = await management.softDelete(props.token, selectedProduct.id);

                /* Display soft deleted message */
                if (res.status === "success") {
                    console.log("Product soft deleted");
                    alert("The product was soft deleted but still can be seen.");
                }
                /* Display message error */
                else{
                    handlers.sofDelete.errors.submit = res.message;
                }
            }
        }),

        delete: useFormik({
            initialValues: {},
            onSubmit: async (values) => {
                /* Send http request and get response */
                const res = await management.delete(props.token, selectedProduct.id);

                /* Display deleted message */
                if (res.status === "success") {
                    console.log("Product soft deleted");
                    alert("The product was deleted, please refresh the page.");
                }
                /* Display message error */
                else{
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


    /* Product selection management */
    const handleSelect = (event) => {
        let index = event.target.value;
        if (isInteger(index)) {
            setGetSelection({id: data.data[index]._id, tag: data.data[index].tag, name: data.data[index].name});
        } else {
            setGetSelection({id: "", tag: "", name: ""});
        }
    };
    const [selectedProduct, setGetSelection] = useState({id: "", tag: "", name: ""});


    /**
     * Select the form depending on the action
     *
     * @param action
     * @returns {JSX.Element}
     */
    function renderFormContent(action) {
        switch (action) {
            case "add":
                return <ProductFormAdd handler={handlers.add}/>

            case "get all":
                return <ProductFormGetAll token={props.token}/>

            case "update":
                /* Start by getting all products */
                if (!data.fetching) {
                    data.fetching = true;
                }

                return <ProductFormUpdate handler={handlers.update}
                                          handleSelect={handleSelect}
                                          listProducts={data.data}
                                          selectedProduct={selectedProduct}
                                          baseHandlerValue={"\o"}/>;

            case "softDelete":

                /* Start by getting all products */
                if (!data.fetching) {
                    data.fetching = true;
                }

                return <ProductFormDelete title="Soft delete a Product"
                                          handler={handlers.sofDelete}
                                          handleSelect={handleSelect}
                                          listProducts={data.data}
                                          selectedProduct={selectedProduct}/>;

            case "delete":
                /* Start by getting all products */
                if (!data.fetching) {
                    data.fetching = true;
                }

                return <ProductFormDelete title="Delete a Product"
                                          handler={handlers.delete}
                                          handleSelect={handleSelect}
                                          listProducts={data.data}
                                          selectedProduct={selectedProduct}/>;

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
                <h2>Product management</h2>

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
                                    setGetSelection({id: "", tag: "", name: ""})
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

export default Product;