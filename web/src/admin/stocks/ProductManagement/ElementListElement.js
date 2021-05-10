function ElementListElement({item, onSelect}) {
    const a = new Date(item.entryDate);
    return <div className={"ProductList"} onClick={() => onSelect(item)}>
        Price {item.price} | Entry Date: {a.toLocaleString('en-gb',
        { year: 'numeric', month: 'numeric', day: 'numeric' })}
    </div>;
}

export default ElementListElement;