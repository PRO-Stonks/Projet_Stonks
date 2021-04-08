import React from "react";

function LogInForm(props){
   // const [email, setEmail] = useState("")
    return (
        <div>
            <h1>Stonks Login</h1>
            <form>
                <label>
                    email: <input type="text" />
                </label>
            </form>
        </div>
    )
}

export default LogInForm;