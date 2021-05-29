function AlertListElement({item, onSelect}) {
    return <div className={"ProductList"} >
        {item?.idElement?.idProduct?.name} | {new Date(item?.idElement?.exitDate).toLocaleString('en-gb',
        { year: 'numeric', month: 'numeric', day: 'numeric' })} | {item?.idElement?.idLocation?.name}
    </div>;
}

export default AlertListElement;