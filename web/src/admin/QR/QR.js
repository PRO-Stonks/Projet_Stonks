import React, {useEffect, useState} from "react";
import PrinterWrapper from "./PrinterWrapper";
import API_URL from "../../utils/URL";
import {useFormik} from "formik";
import {Col, Row} from "react-bootstrap";


async function askForQR(token) {
    try {
        console.log(token)
        const response = await fetch(API_URL + 'QR/add', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer',
            //body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}

function QR(props) {

    const [codes, setCodes] = useState([]);
    const handleGeneration = useFormik({
        initialValues: {
            nbQr: 0
        },
        onSubmit: async (values) => {
            if (values.nbQr < 1) {
                handleGeneration.errors.submit = "Requested number of QR to generate must be > 0!";
            } else {
                let tmpCodes = [];
                for (let i = 0; i < values.nbQr; ++i) {
                    await askForQR(props.token).then(qr => {
                            tmpCodes.push(qr.data.code);
                        }
                    );
                }
                setCodes(tmpCodes);
            }
        }
    })

    return (
        <div className="container">
            <h2>QR management</h2>
            <br/>
            <Row>
                {/* Generation */}
                <Col>
                    <h4>Generate</h4>

                    {/* Number orm */}
                    <div className="container w-50">
                        <label className="form-check-label">Enter the number</label>
                        <form className="form-group" onSubmit={handleGeneration.handleSubmit}>
                            {/* Number of QR */}
                            <input
                                className="form-control"
                                placeholder="Number of QR"
                                id="nbQr"
                                name="nbQr"
                                type="number"
                                value={handleGeneration.values.nbQr}
                                min="1"
                                max="12"
                                onChange={handleGeneration.handleChange}
                                onBlur={handleGeneration.handleBlur}
                            />
                            <br/>

                            {/* Submit button */}
                            <button className="btn-success" type="submit">Submit</button>
                        </form>
                    </div>
                    <br/>

                    {/* QR images and print button*/}
                    <div className="container-fluid">
                        {codes.length ? <PrinterWrapper codes={codes}/> : ""}
                    </div>
                </Col>

                {/* Deletion */}
                <Col>
                    <h4>Delete</h4>
                    #todo
                </Col>
            </Row>
        </div>
    );
}

export default QR;