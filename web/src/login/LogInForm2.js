import {useFormik} from 'formik';
import Spinner from "../utils/Spinner";
import API_URL from "../utils/URL";
import validateEmail from "../utils/validateEmail";

async function getData(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
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

    if (!values.password) {
        errors.password = "Password cannot be empty";
    } else if (values.password.length < 8) {
        errors.password = "Password must have at least 8 character.";
    }

    return errors;
}

const LogInForm2 = (props) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate,
        onSubmit: async (values) => {
            const res = await getData(API_URL+"users/login", values);
            if (res.status === "fail"){
                formik.errors.submit = res.message;
            }else{
                console.log("Is ok");
                props.handleChangeProps({loggedIn: true, user: res.data.user, token: res.token})
            }
        },
    });

    return (
        <form className="container w-50" onSubmit={formik.handleSubmit}>

            <label className="form-check-label" htmlFor="email">Email Address </label>
            <input
                className="form-control"
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? <div className="Error">{formik.errors.email}</div> : ""}

            <label className="form-check-label" htmlFor="password">Password </label>
            <input
                className="form-control"
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? <div className="Error">{formik.errors.password}</div> :
                <br/>}

            <button className="btn-primary" type="submit">Submit</button>
            <br/>
            <Spinner enabled={formik.isSubmitting}/>
            {formik.errors.submit ? <div className="Error">{formik.errors.submit}</div> :
                <br/>}
        </form>
    );
};

export default LogInForm2;