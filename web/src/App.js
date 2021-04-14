import logo from './assets/stonks4.png';
import './App.css';
import LogInForm2 from "./login/LogInForm2";
import MainPage from "./MainPage";
import React, {useEffect, useState} from "react";


function App() {
    const [state, setState] = useState({loggedIn: false, user: {}, token: ""});
    const handleChange = e => {
        console.log(e)
        setState(e);

        localStorage.setItem("token", e.token);
        localStorage.setItem("user", JSON.stringify(e.user));
    }


    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const tokenArray = token.split('.');
            const payload = JSON.parse(atob(tokenArray[1]));
            const current_time = Date.now().valueOf() / 1000;
            if(payload.exp < current_time){
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            }else{
                setState(
                    {
                        token,
                        user: JSON.parse(localStorage.getItem("user")),
                        loggedIn: true
                    }
                )
            }
        }
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p className="Logo-text-down">Not Stonks</p>
                <p className="Logo-text-up">Stonks</p>
                {state.loggedIn ? <MainPage user={state.user} token={state.token}/> :
                    <LogInForm2 handleChangeProps={handleChange}/>}
            </header>
        </div>
    );

}

export default App;
