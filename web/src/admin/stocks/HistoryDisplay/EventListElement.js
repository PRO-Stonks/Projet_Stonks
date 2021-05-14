function EventListElement({item, onSelect}) {
    const a = new Date(item.entryDate);
    return <div className={"ProductList"} >
        {item.change}
    </div>;
}

export default EventListElement;