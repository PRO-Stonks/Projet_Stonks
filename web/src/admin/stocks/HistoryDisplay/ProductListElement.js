function ProductListElement({item, onSelect}) {
    return <div className={"LocationList"} onClick={() => onSelect(item)}>
        {item.name}
    </div>;
}

export default ProductListElement;