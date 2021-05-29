import Spinner from "../../../utils/Spinner";
import LogListElementNoUser from "./LogListElementNoUser";
import List from "../../../utils/list/List";

function LogByUserManager({user, token, ...props}) {

    return <div>
        <h2>{user.email}</h2>
        <List token={token} item={LogListElementNoUser} spinner={Spinner} url={"events/connections/user/"+user._id}/>
    </div>;
}

export default LogByUserManager;