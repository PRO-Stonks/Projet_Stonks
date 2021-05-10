function ElementListElement({item, onSelect}) {
    const a = new Date(item.entryDate);
    return <div className={"LocationList"} >
        Price {item.price} | Entry Date: {a.toLocaleString('en-gb',
        { year: 'numeric', month: 'numeric', day: 'numeric' })}
    </div>;
}

export default ElementListElement;