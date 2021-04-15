import {useFormik} from 'formik';

async function addProduct(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}

async function getProduct(url) {
    try {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}

async function getAllProduct() {
    const url = "http://localhost:4000/api/v1/products/";
    try {
        const response = await fetch(url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}

async function updateProduct(url, data) {
    try {
        const response = await fetch(url, {
            method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': 'Bearer ' + localStorage.token,
                'Content-Type': 'application/json'
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json();
    } catch (e) {
        console.log(e);
    }
}


const ProductForm = (props) => {
    const formikAdd = useFormik({
        initialValues: {
            name: '',
            tag: ''
        },
        onSubmit: async (values) => {
            const res = await addProduct("http://localhost:4000/api/v1/products/add", values);
            if (res.status === "fail") {
                formikAdd.errors.submit = res.message;
            } else {
                console.log("Is ok");
                alert("The product: " + JSON.stringify(res.data.name) + " has correctly been added");
            }
        }
    });

    const formikGet = useFormik({
        initialValues: {
            id: ' '
        },
        onSubmit: async (values) => {
            const res = await getProduct("http://localhost:4000/api/v1/products/" + values.id);
            if (res.status === "fail") {
                formikGet.errors.submit = res.message;
            } else {
                console.log("Is ok");
                alert("This is your product:\n" + JSON.stringify(res.data));
            }
        }
    });

    const formikGetAll = useFormik({
        initialValues: {
            none: ''
        },
        onSubmit: async () => {
            const res = await getAllProduct();
            if (res.status === "fail") {
                formikGet.errors.submit = res.message;
            } else {
                console.log("Is ok");
                alert("This is all the products:\n" + JSON.stringify(res.data));
            }
        }
    });

    const formikUpdate = useFormik({
        initialValues: {
            id: '..',
            name: '',
            tag: ''
        },
        onSubmit: async (values) => {
            const res = await updateProduct("http://localhost:4000/api/v1/products/" + values.id, {
                name : values.name, tag: values.tag });
            if (res.status === "fail") {
                formikGet.errors.submit = res.message;
            } else {
                console.log("Is ok");
                alert("This is the updated products:\n" + JSON.stringify(res.data));
            }
        }
    });


    return (
        <div>
            <form onSubmit={formikAdd.handleSubmit}>
                ADD Product<br/>
                <label htmlFor="name">Name </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.name}
                />

                <label htmlFor="tag">Tag </label>
                <input
                    id="tag"
                    name="tag"
                    type="text"
                    onChange={formikAdd.handleChange}
                    onBlur={formikAdd.handleBlur}
                    value={formikAdd.values.tag}
                    size="50"
                />

                <button type="submit">Submit</button>
                {formikAdd.errors.submit ? <div className="Error">{formikAdd.errors.submit}</div> : <br/>}
            </form>

            <form onSubmit={formikGet.handleSubmit}>
                GET Product<br/>
                <label htmlFor="id">ID </label>
                <input
                    id="id"
                    name="id"
                    type="text"
                    onChange={formikGet.handleChange}
                    onBlur={formikGet.handleBlur}
                    value={formikGet.values.id}
                />

                <button type="submit">Submit</button>
                {formikGet.errors.submit ? <div className="Error">{formikGet.errors.submit}</div> : <br/>}
            </form>

            <form onSubmit={formikGetAll.handleSubmit}>
                GET all Products<br/>
                <button type="submit">Submit</button>
            </form>

            <form onSubmit={formikUpdate.handleSubmit}>
                UPDATE Product<br/>

                <label htmlFor="id">ID </label>
                <input
                    id="id"
                    name="id"
                    type="text"
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                    value={formikUpdate.values.id}
                />

                <label htmlFor="name">Name </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                    value={formikUpdate.values.name}
                />

                <label htmlFor="tag">Tag </label>
                <input
                    id="tag"
                    name="tag"
                    type="text"
                    onChange={formikUpdate.handleChange}
                    onBlur={formikUpdate.handleBlur}
                    value={formikUpdate.values.tag}
                    size="50"
                />

                <button type="submit">Submit</button>
                {formikUpdate.errors.submit ? <div className="Error">{formikUpdate.errors.submit}</div> : <br/>}
            </form>

        </div>
    );
}

export default ProductForm;