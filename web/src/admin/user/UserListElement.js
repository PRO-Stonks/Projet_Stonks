function UserListElement({item, onSelect}) {

    if(item.active) {
        return <div className={"UserSelection"} onClick={() => onSelect(item)}>
            {item.lastName} {item.firstName}, {item.email}
        </div>;
    } else {
        return <div className="text-secondary" onClick={() => onSelect(item)}>
            {item.lastName} {item.firstName}, {item.email}
        </div>;
    }
}

export default UserListElement;