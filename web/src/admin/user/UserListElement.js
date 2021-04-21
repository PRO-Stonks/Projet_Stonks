
function UserListElement({item, onSelect}) {
    return <div className={"UserSelection"} onClick={() => onSelect(item)}>
        {item.firstName} {item.lastName}
    </div>;
};
export default UserListElement;