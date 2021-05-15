function LogListElement({item, onSelect}) {
    const time =new Date(item.time)
    return <div className={"LogListElement"}>
        <tr>
            <td width={"20%"}>{item.user.email}</td>
            <td width={"40%"}>{time.toLocaleString('en-GB', {hour12: false})}</td>
            <td width={"20%"}>{item.ip}</td>
            <td width={"20%"}>{item.userAgent.substring(0, item.userAgent.indexOf("/"))}</td>
        </tr>
    </div>;
}

export default LogListElement;