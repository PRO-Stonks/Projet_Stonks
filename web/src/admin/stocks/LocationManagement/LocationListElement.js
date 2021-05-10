function LocationListElement({item, onSelect}) {
    return <div className={"LocationList"} onClick={() => onSelect(item)}>
        {item.name}
    </div>;
}

export default LocationListElement;