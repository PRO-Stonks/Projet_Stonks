function AlertListProduct({item, onSelect}) {
    return <div className={"ProductList"} >
        {item.idProduct.name} | less than {item.idProduct.lowQuantity}
    </div>;
}

export default AlertListProduct;