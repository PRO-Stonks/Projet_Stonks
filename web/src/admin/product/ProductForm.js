import {useFormik} from "formik";
import ProductManagement from "./ProductManagement";
import React, {useState} from "react";
import {
    Card,
    FormControl, FormLabel,
    Step,
    StepLabel,
    Stepper, TextField,
} from '@material-ui/core';


function ProductForm(props) {

    const management = new ProductManagement();

    let handleAdd = useFormik({
        initialValues: {
            name: '',
            tag: ''
        },
        onSubmit: async (values) => {
            const res = await management.add(props.token, values);
            if (res.status === "fail") {
                handleAdd.errors.submit = res.message;
            } else {
                console.log("Product added");
                alert("The product: " + JSON.stringify(res.data.name) + " has correctly been added");
            }
        }
    });

    const handleGet = useFormik({
        initialValues: {
            id: ''
        },
        onSubmit: async (values) => {
            const res = await management.get(props.token, values.id);
            if (res.status === "fail") {
                handleGet.errors.submit = res.message;
            } else {
                console.log("Product got");
                alert("This is your requested product:\n" + JSON.stringify(res.data));
            }
        }
    });

    const handleGetAll = useFormik({
        initialValues: {
            none: ''
        },
        onSubmit: async () => {
            const res = await management.getAll(props.token);
            if (res.status === "fail") {
                handleGetAll.errors.submit = res.message;
            } else {
                console.log("All Products got");
                alert("This is all the products:\n" + JSON.stringify(res.data));
            }
        }
    });

    const handleUpdate = useFormik({
        initialValues: {
            id: '',
            name: '',
            tag: ''
        },
        onSubmit: async (values) => {
            const res = await management.update(props.token, values.id,
                {name: values.name, tag: values.tag});
            if (res.status === "fail") {
                handleUpdate.errors.submit = res.message;
            } else {
                console.log("Product updated");
                alert("This is the updated product:\n" + JSON.stringify(res.data));
            }
        }
    });

    const handleSoftDelete = useFormik({
        initialValues: {
            id: ''
        },
        onSubmit: async (values) => {
            const res = await management.softDelete(props.token, values.id);
            if (res.status === "fail") {
                handleSoftDelete.errors.submit = res.message;
            } else {
                console.log("Product soft deleted");
                alert("The product has been soft deleted but still can be seen.");
            }
        }
    });

    const handleDelete = useFormik({
        initialValues: {
            id: ''
        },
        onSubmit: async (values) => {
            const res = await management.delete(props.token, values.id);
            if (res.status === "fail") {
                handleDelete.errors.submit = res.message;
            } else {
                console.log("Product deleted");
                alert("The product has been deleted.");
            }
        }
    });

    /*
    <div>

        <form onSubmit={forms.handleGet.handleSubmit}>
            GET Product<br/>
            <label htmlFor="id">ID </label>
            <input
                id="id"
                name="id"
                type="text"
                onChange={forms.handleGet.handleChange}
                onBlur={forms.handleGet.handleBlur}
                value={forms.handleGet.values.id}
            />

            <button type="submit">Submit</button>
            {forms.handleGet.errors.submit ? <div className="Error">{forms.handleGet.errors.submit}</div> : <br/>}
        </form>

        <form onSubmit={forms.handleUpdate.handleSubmit}>
            UPDATE Product<br/>

            <label htmlFor="id">ID </label>
            <input
                id="id"
                name="id"
                type="text"
                onChange={forms.handleUpdate.handleChange}
                onBlur={forms.handleUpdate.handleBlur}
                value={forms.handleUpdate.values.id}
            />

            <label htmlFor="name">Name </label>
            <input
                id="name"
                name="name"
                type="text"
                onChange={forms.handleUpdate.handleChange}
                onBlur={forms.handleUpdate.handleBlur}
                value={forms.handleUpdate.values.name}
            />

            <label htmlFor="tag">Tag </label>
            <input
                id="tag"
                name="tag"
                type="text"
                onChange={forms.handleUpdate.handleChange}
                onBlur={forms.handleUpdate.handleBlur}
                value={forms.handleUpdate.values.tag}
                size="50"
            />

            <button type="submit">Submit</button>
            {forms.handleUpdate.errors.submit ? <div className="Error">{forms.handleUpdate.errors.submit}</div> : <br/>}
        </form>

        <form onSubmit={forms.handleSoftDelete.handleSubmit}>
            SOFTDEL Product<br/>
            <label htmlFor="id">ID </label>
            <input
                id="id"
                name="id"
                type="text"
                onChange={forms.handleSoftDelete.handleChange}
                onBlur={forms.handleSoftDelete.handleBlur}
                value={forms.handleSoftDelete.values.id}
            />

            <button type="submit">Submit</button>
            {forms.handleSoftDelete.errors.submit ? <div className="Error">{forms.handleSoftDelete.errors.submit}</div> : <br/>}
        </form>

        <form onSubmit={forms.handleDelete.handleSubmit}>
            DEL Product<br/>
            <label htmlFor="id">ID </label>
            <input
                id="id"
                name="id"
                type="text"
                onChange={forms.handleDelete.handleChange}
                onBlur={forms.handleDelete.handleBlur}
                value={forms.handleDelete.values.id}
            />

            <button type="submit">Submit</button>
            {forms.handleDelete.errors.submit ? <div className="Error">{forms.handleDelete.errors.submit}</div> : <br/>}
        </form>

    </div>
     */


    function renderFormContent(action) {
        switch (action) {
            case "add":
                return (
                    <form onSubmit={handleAdd.handleSubmit}>
                        ADD Product<br/>
                        <label htmlFor="name">Name </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            onChange={handleAdd.handleChange}
                            onBlur={handleAdd.handleBlur}
                            value={handleAdd.values.name}
                        />

                        <label htmlFor="tag">Tag </label>
                        <input
                            id="tag"
                            name="tag"
                            type="text"
                            onChange={handleAdd.handleChange}
                            onBlur={handleAdd.handleBlur}
                            value={handleAdd.values.tag}
                            size="50"
                        />

                        <button type="submit">Submit</button>
                        {handleAdd.errors.submit ? <div className="Error">{handleAdd.errors.submit}</div> :
                            <br/>}
                    </form>);

            case "get":
                return <h1>get</h1>;

            case "get all":
                return (
                    <form onSubmit={handleGetAll.handleSubmit}>
                        GET all Products<br/>
                        <button type="submit">Submit</button>
                    </form>
                );

            case "update":
                return <h1>update</h1>;
            case "softDelete":
                return <h1>soft delete</h1>;
            case "delete":
                return <h1>delete</h1>;
            default:
                return <div>Not Found</div>;
        }
    }

    const actions = ["add", "get", "get all", "update", "softDelete", "delete"];
    const steps = ['Action', 'Details'];
    let [activeStep, setActiveStep] = useState(0);

    const handleAction = (event) => {
        setAction(event.target.value);
    };

    const [action, setAction] = React.useState('none');

    return (
        <React.Fragment>
            <br/>
            <div className="container">
                <h2>Product management</h2>
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
                                    setActiveStep(activeStep - 1)
                                }}>
                                BACK
                            </button>
                        </div>
                    </center>
                    :
                    <center>
                        {/* Action Form */}
                        <Card className="col-3" style={{backgroundColor: "whitesmoke", textAlign: "center"}}>
                            <FormControl>
                                <FormLabel style={{marginTop: 10}}>
                                    Select an action
                                </FormLabel>

                                <TextField
                                    id="Action-select"
                                    select
                                    label="Select"
                                    value={action}
                                    margin="dense"
                                    onChange={handleAction}
                                    SelectProps={{
                                        native: true,
                                    }}
                                    helperText="Please select an Action"
                                    variant="outlined"
                                >
                                    {actions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </TextField>
                            </FormControl>
                        </Card>

                        {/* Next button */}
                        <button
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

export default ProductForm;