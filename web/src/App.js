import LogInForm2 from "./login/LogInForm2";
import React, {useEffect, useState} from "react";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Navigation from "./pages/Navigation";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Footer from "./pages/Footer";
import logo from "./assets/stonks4.png";

function App() {
    const [state, setState] = useState({loggedIn: false, user: {}, token: ""});
    const handleChange = e => {
        console.log(e)
        setState(e);

        localStorage.setItem("token", e.token);
        localStorage.setItem("user", JSON.stringify(e.user));
    }

    const handleLogOut = () => {
        setState({loggedIn: false, user: {}, token: ""});
        localStorage.setItem("token", "");
        localStorage.setItem("user", "");
    }


    useEffect(() => {
        let token = localStorage.getItem("token");
        if (token) {
            token = token.split('.');
            const payload = JSON.parse(atob(token[1]));
            const current_time = Date.now().valueOf() / 1000;
            if (payload.exp < current_time) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
            } else {
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
            <Router>
                <Navigation handleLogOut={handleLogOut}/>
                <Switch>
                    <Route path="/" exact component={() => state.loggedIn ?
                        <HomePage user={state.user} token={state.token}/> :
                        <div>
                            <div className="welcome">
                                <div className="container">
                                    <div className="row align-items-center my-5">
                                        <div className="col-lg-7">
                                            <img src={logo} className="App-logo" alt="logo"/>
                                            <h1 className="font-weight-light">Stonks</h1>
                                            <p>
                                                Welcome to Stonks !
                                            </p>
                                        </div>
                                        <div className="col-lg-5">
                                            <h1 className="font-weight-light">Log-in</h1>
                                            <LogInForm2 handleChangeProps={handleChange}/>
                                            <br/>
                                            <h1 className="font-weight-light">Sign-up</h1>
                                            #TODO
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }/>
                    <Route path="/about" exact component={() => <About/>}/>
                </Switch>
                <Footer/>
            </Router>
        </div>
    );

    /* image de l'apocalypse
    <img src={logo} className="App-logo" alt="logo"/>
                <p className="Logo-text-down">Not Stonks</p>
                <p className="Logo-text-up">Stonks</p>
     */
}

export default App;
