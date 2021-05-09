import React from "react";
import {Card, FormControl, FormLabel, TextField} from "@material-ui/core";

function ActionsForm(props) {

    const actions = ["none", "add", "get all", "update", "softDelete", "delete"];
    const handleAction = (event) => {
        props.setAction(event.target.value);
    };

    return (
        <React.Fragment>
            <Card className="col-3" style={{backgroundColor: "whitesmoke", textAlign: "center"}}>
                <FormControl>
                    <FormLabel style={{marginTop: 10}}>
                        Action
                    </FormLabel>

                    <TextField
                        id="Action-select"
                        select
                        label="Select"
                        value={props.action}
                        margin="dense"
                        onChange={handleAction}
                        SelectProps={{
                            native: true,
                        }}
                        helperText={props.action === "none" ? "Please select an Action !" : ""}
                        variant="outlined"
                        error={props.action === "none"}
                    >
                        {actions.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}

                    </TextField>
                </FormControl>
            </Card>
        </React.Fragment>
    );
}

export default ActionsForm;