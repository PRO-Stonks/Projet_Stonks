import React, {useState} from "react";

function LogInForm(props) {
    const [state, setState] = useState({email: "", password: ""});
    const [error, setError] = useState({email: "", password: ""});

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }


    function validatePassword(password) {
        return password.length >= 8;
    }

    const handleChange = e => {
        setState({...state, [e.target.name]: e.target.value.trim()});
        setError({...error, [e.target.name]: ""});
    };

    const handleSubmit = e => {
        e.preventDefault();
        if (state.email.length === 0) {
            setError({...error, email: "Email cannot be empty"});
        } else if (!validateEmail(state.email)) {
            setError({...error, email: "Email must have a valid email format"});
        }

        if (!validatePassword(state.password)) {
            setError({...error, password: "Password must have at least 8 character."});
        }
    };
    return (
        <div>
            <h1>Stonks Login</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:{" "}
                    <input
                        type="email"
                        name="email" value={state.email} onChange={handleChange}
                    />
                </label>
                <br/>
                {error.email.length > 0 && <span className="Error">   {error.email}</span>}
                <br/>
                <label> Password:{" "} <input type="password" name="password" value={state.password}
                                              onChange={handleChange}/>
                </label>
                <br/>
                {error.password.length > 0 && <span className="Error">Error {error.password}</span>}
                <br/>
                <button>Submit</button>
            </form>
        </div>
    )
}

export default LogInForm;