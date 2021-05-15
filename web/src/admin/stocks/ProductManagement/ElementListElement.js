function ElementListElement({item, onSelect}) {
    const a = new Date(item.entryDate);
    if(!item.active){
        return null
    }
    return <div className={"ProductList"} >
        Price {item.price} | Entry Date: {a.toLocaleString('en-gb',
        { year: 'numeric', month: 'numeric', day: 'numeric' })}
    </div>;
}

export default ElementListElement;