
function UserListElement({item, onSelect}) {
    return <div className={"UserSelection"} onClick={() => onSelect(item._id)}>
        {item.role} {item.email} {item.firstName} {item.lastName}
    </div>;
};
export default UserListElement;