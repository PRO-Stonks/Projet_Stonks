import React, {useState} from "react";
import PrinterWrapper from "./PrinterWrapper";
import API_URL from "../../utils/URL";
import {useFormik} from "formik";
import {Col, Row} from "react-bootstrap";

async function askForQR(token) {
    try {
        const response = await fetch(API_URL + 'QR/add', {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}

async function clear(token) {
    try {
        const response = await fetch(
            API_URL + "QR/",
            {
                method: 'DELETE',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
            });
        return response.status === 204 ? {status: "success"} : response.json();
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
            if (values.nbQr < 1 || values.nbQr > 12) {
                handleGeneration.errors.submit = "Requested number of QR to generate belongs to [1, 12]";
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
                {/*
                    <Col>
                        <h4>Clear All</h4>
                        <br/>
                        <button className="btn-danger" onClick={() => {
                            clear(props.token).then(() => alert("All QR have been deleted"));
                        }}>
                            Delete
                        </button>
                    </Col>
                    */
                }
            </Row>
        </div>
    );
}

export default QR;