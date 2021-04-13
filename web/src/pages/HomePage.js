import React from "react";
import Product from "../product/ProductForm";

function HomePage(props) {
    return (
        <div className="home">
            {props.user.email}
                <Product token={props.token}/>
        </div>
    );
}

export default HomePage;