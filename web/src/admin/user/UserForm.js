import API_URL from "../../utils/URL";
import Spinner from "../../utils/Spinner";
import {Field, Form, Formik} from 'formik';
import validateEmail from "../../utils/validateEmail";

async function getData(url, data, token, method = 'POST') {
    try {
        const response = await fetch(url, {
            method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}


const validate = values => {
    const errors = {};
    if (!values.email) {
        errors.email = "Email cannot be empty";
    } else if (!validateEmail(values.email)) {
        errors.email = "Invalid email address";
    }
    if (values.password && values.password.length > 0 && values.password.length < 8) {
        errors.password = "Password must have at least 8 character.";
    }


    if (!values.firstName) {
        errors.firstName = "First name cannot be empty";
    }
    if (!values.lastName) {
        errors.lastName = "Last name cannot be empty";
    }

    return errors;
}

function getChanges(original, changed) {
    let output = {};
    if (original.firstName !== changed.firstName) {
        output.firstName = changed.firstName;
    }

    if (original.firstName !== changed.firstName) {
        output.firstName = changed.firstName;
    }

    if (original.lastName !== changed.lastName) {
        output.lastName = changed.lastName;
    }

    if (original.role !== changed.role) {
        output.role = changed.role;
    }

    if (original.email !== changed.email) {
        output.email = changed.email;
    }

    if (changed.password && changed.password.length > 8) {
        output.password = changed.password;
    }
    console.log("Changes")
    console.log(output)
    return output;
}

const UserForm = (props) => {
    return (
        <Formik
            initialValues={props.userData}
            validate={validate}
            onSubmit={async (values, actions) => {

                let res;
                if (props.action === "update") {
                    const data = getChanges(props.userData, values);
                    res = await getData(API_URL + "users/" + props.userData.id, data, props.token, 'PATCH');
                } else if (props.action === "add") {
                    res = await getData(API_URL + "users/signup", values, props.token);
                }

                if (res.status === "fail") {
                    actions.setFieldError("submit", res.message);
                } else {
                    props.refreshHandler(res.data);
                }
            }}
        >
            {formik => (
                <Form>
                    <label className="form-check-label" htmlFor="firstName">First name </label>
                    <Field
                        className="form-control"
                        id="firstName"
                        name="firstName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstName}
                    />
                    {formik.touched.firstName && formik.errors.firstName ?
                        <div className="Error">{formik.errors.firstName}</div> :
                        <br/>}
                    <label className="form-check-label" htmlFor="lastName">Last name </label>
                    <Field
                        className="form-control"
                        id="lastName"
                        name="lastName"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastName}
                    />
                    {formik.touched.lastName && formik.errors.lastName ?
                        <div className="Error">{formik.errors.lastName}</div> :
                        <br/>}
                    <label className="form-check-label" htmlFor="email">Email Address </label>
                    <Field
                        className="form-control"
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? <div className="Error">{formik.errors.email}</div> :
                        <br/>}

                    <label className="form-check-label" htmlFor="password">Password </label>
                    <Field
                        className="form-control"
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                    />
                    {formik.touched.password && formik.errors.password ?
                        <div className="Error">{formik.errors.password}</div> :
                        <br/>}
                    <label className="form-check-label" htmlFor="role">Role </label>
                    <Field
                        className="custom-select"
                        as="select"
                        id="role"
                        name="role"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.role}
                    >
                        <option value={"manager"}>Manager</option>
                        <option value={"admin"}>Admin</option>
                    </Field>
                    {formik.touched.firstName && formik.errors.firstName ?
                        <div className="Error">{formik.errors.firstName}</div> :
                        <br/>}
                    <br/>
                    <button type="submit">Submit</button>
                    <Spinner enabled={formik.isSubmitting}/>
                    {formik.errors.submit ? <div className="Error">{formik.errors.submit}</div> :
                        <br/>}
                </Form>)}
        </Formik>
    );
};

export default UserForm;