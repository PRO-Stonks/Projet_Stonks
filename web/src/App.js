import logo from './assets/stonks4.png';
import './App.css';
import LogInForm2 from "./login/LogInForm2";
import MainPage from "./MainPage";
import React, {useState} from "react";

function App() {
    const [state, setState] = useState({loggedIn: false, user: {}, token: ""});
    const handleChange = e => {
        console.log(e)
        setState(e);
    };
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
