import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import Navigation from "./NavAdmin";
import About from "./About";
import Product from "../admin/product/Product";
import QR from "../admin/QR/QR";
import List from "../utils/list/List";
import ItemTest from "../utils/list/Itemtest";
import Spinner from "../utils/Spinner";
import UserManagementMenu from "../admin/user/UserManagementMenu";
import Location from "../admin/location/Location";

/* This home page is specific to Admins
    #TODO later for manager
*/
function HomePage(props) {
    return (
        <div>
            <Router>
                {/* Navigation bar */}
                <Navigation handleLogOut={props.handleLogOut}/>

                {/* Pages per route */}
                <Switch>
                    {/* Home page */}
                    <Route path="/" exact component={() =>
                        <div className="container">
                            <div className="home">
                                {/* Welcome message */}
                                <br/>
                                <h1>Welcome {props.user.firstName}</h1>
                                <p>This is your home page.<br/>
                                    From here, you can access and manage different items</p>
                                <br/>

                                {/* Row with management and user cards */}
                                <div className="row align-content-center">

                                    {/* User card with personal data */}
                                    <div className="col">
                                        <div className="card bg-dark mb-3">
                                            <div className="card-body">
                                                <h3 className="card-title">Personal data</h3>
                                                <p className="card-text">First Name: {props.user.firstName}<br/>
                                                    Last Name: {props.user.lastName}<br/>
                                                    Email: {props.user.email}<br/>
                                                    Role: {props.user.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Management card with links to specific pages */}
                                    <div className="col card bg-dark mb-3">
                                        <div className="card-body">
                                            {/* Card title */}
                                            <h3 className="card-title">Management</h3>

                                            {/* Card description */}
                                            <p className="card-text">Click below to manage your item</p>

                                            {/* Buttons for specific management page item */}
                                            <Link className="nav-link btn btn-secondary" to="/users">Users</Link><br/>
                                            <Link className="nav-link btn btn-secondary" to="/products">Products</Link><br/>
                                            <Link className="nav-link btn btn-secondary" to="/elements">Elements</Link><br/>
                                            <Link className="nav-link btn btn-secondary"
                                                  to="/locations">Locations</Link><br/>
                                            <Link className="nav-link btn btn-secondary" to="/QR">QR</Link><br/>
                                            <Link className="nav-link btn btn-secondary" to="/Logs">Logs</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }/>

                    {/* About page */}
                    <Route path="/about" exact component={() => <About/>}/>

                    {/* User management page */}
                    <Route path="/users" exact component={() => <UserManagementMenu token={props.token} user={props.user}/>}/>

                    {/* Product management page */}
                    <Route path="/products" exact component={() => <Product token={props.token}/>}/>

                    {/* Location management page */}
                    <Route path="/locations" exact component={() => <Location token={props.token}/>}/>

                    {/* QR management page */}
                    <Route path="/QR" exact component={() => <QR token={props.token}/>}/>

                    {/* #TODO Pages below are not implemented yet */}
                    <Route path="/elements" exact component={() => <List token={props.token} item={ItemTest} spinner={Spinner} url={"QR"} proptest={"ajjajajaj"} select={"code"}/>}/>
                    <Route path="/logs" exact component={() => <About/>}/>
                </Switch>
            </Router>
        </div>
    );
}

export default HomePage;