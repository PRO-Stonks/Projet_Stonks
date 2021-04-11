import {useFormik} from 'formik';
import Spinner from "../Spinner";

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

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
            const res = await getData("http://localhost:4000/api/v1/users/login", values);
            if (res.status === "fail"){
                formik.errors.submit = res.message;
            }else{
                console.log("Is ok");
                props.handleChangeProps({loggedIn: true, user: res.data.user, token: res.token})
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit}>

            <label htmlFor="email">Email Address </label>
            <input
                id="email"
                name="email"
                type="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email ? <div className="Error">{formik.errors.email}</div> : <br/>}

            <label htmlFor="password">Password </label>
            <input
                id="password"
                name="password"
                type="password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password ? <div className="Error">{formik.errors.password}</div> :
                <br/>}

            <button type="submit">Submit</button>
            <Spinner enabled={formik.isSubmitting}/>
            {formik.errors.submit ? <div className="Error">{formik.errors.submit}</div> :
                <br/>}
        </form>
    );
};

export default LogInForm2;