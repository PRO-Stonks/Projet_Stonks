function LocationListElement({item, onSelect}) {
    return <div className={item.active ? "LocationList":"text-secondary"} onClick={() => onSelect(item)}>
        {item.name}
    </div>;
}

export default LocationListElement;