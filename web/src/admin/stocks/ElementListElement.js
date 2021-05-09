function ElementListElement({item, onSelect}) {
    const a = new Date(item.entryDate);
    console.log(item)
    return <div className={"LocationList"} onClick={() => onSelect(item)}>
        Price {item.price} | Entry Date: {a.toLocaleString('en-gb',
        { year: 'numeric', month: 'numeric', day: 'numeric' })} |
         Product : {item.idProduct.name}
    </div>;
}

export default ElementListElement;