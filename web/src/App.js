import LogInForm2 from "./login/LogInForm2";
import React, {useEffect, useState} from "react";
import './css/App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navigation from "./pages/NavWelcome";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Footer from "./pages/Footer";
import logo from "./assets/stonks4.png";

function App() {
    const [state, setState] = useState({loggedIn: false, user: {}, token: ""})
    const handleLogIn = e => {
        console.log(e)
        setState(e);
        localStorage.setItem("token", e.token);
        localStorage.setItem("user", JSON.stringify(e.user));
    }

    const handleLogOut = () => {
        localStorage.clear();
        setState({loggedIn: false, user: {}, token: ""});
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

    /* If the user is logged-in, render HomePage,
        else render WelcomePage with LogInForm
     */
    return (
        <div className="App">
            {state.loggedIn ?
                <HomePage user={state.user} token={state.token} handleLogOut={handleLogOut}/>
                : <Router>
                    <Navigation/>
                    <Switch>
                        <Route path="/" exact component={() =>
                            <div className="container">
                                <br/>
                                <img src={logo} alt="Stonks logo" width="200" height="200"/>
                                <h1>Welcome to Stonks !</h1>
                                <br/>
                                <div className="row align-content-center">
                                    <div className="col">
                                        <h2>Log-in</h2>
                                        <LogInForm2 handleChangeProps={handleLogIn}/>
                                    </div>
                                    <div className="col">
                                        <h2>Sign-up</h2>
                                        #TODO
                                    </div>
                                </div>
                            </div>
                        }/>
                        <Route path="/about" exact component={() => <About/>}/>
                    </Switch>
                    <Footer/>
                </Router>
            }
        </div>
    );
}

export default App;