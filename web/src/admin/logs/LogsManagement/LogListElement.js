function LogListElement({item, onSelect}) {
    const time =new Date(item.time)
    return <div className={"LogListElement"}>
        {item.user.email} | {time.toLocaleString('en-GB', {hour12: false})} | {item.ip} |
        {item.userAgent.substring(0, item.userAgent.indexOf("/"))}
    </div>;
}

export default LogListElement;