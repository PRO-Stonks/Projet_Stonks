import React from "react";
import logo from "../assets/stonks4.png";

function About() {
    return (
        <div className="about">
            <div className="container">
                <div className="row align-items-center my-5">
                    <div className="col-lg-7">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <p className="Logo-text-down">Not Stonks</p>
                        <p className="Logo-text-up">Stonks</p>
                    </div>

                    <div className="col-lg-5">
                        <h1 className="font-weight-light">About</h1>
                        <h4>Stonks project</h4>
                        <p> For the HEIG-VD PRO course. </p>
                        <p> Authors:<br/>
                            Besseau Léonard<br/>
                            Cerottini Alexandra<br/>
                            Do Vale Lopes Miguel<br/>
                            Gamboni Fiona<br/>
                            Tevaearai Rebecca
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;