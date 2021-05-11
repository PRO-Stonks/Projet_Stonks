function LogListElementNoUser({item, onSelect}) {
    const time =new Date(item.time)
    return <div className={"LogListElement"}>
        <tr>
            <td  width={"20%"} > {time.toLocaleString('en-GB', {hour12: false})}</td>
            <td  width={"20%"}>{item.ip}</td>
            <td  width={"20%"}>{item.userAgent.substring(0, item.userAgent.indexOf("/"))}</td>
        </tr>
    </div>;
}

export default LogListElementNoUser;