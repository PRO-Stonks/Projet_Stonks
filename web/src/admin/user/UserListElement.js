function UserListElement({item, onSelect}) {
    return <div className={"UserSelection"} onClick={() => onSelect(item)}>
        {item.firstName} {item.lastName}, {item.email}
    </div>;
}

export default UserListElement;