import {useFormik} from 'formik';

async function addProduct(token, url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Authorization': 'Bearer ' + token,
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
    const formik = useFormik({
        initialValues: {
            name: '',
            tag: ''
        },
        onSubmit: async (values) => {
            const res = await addProduct(props.token, "http://localhost:4000/api/v1/products/add", values);
            if (res.status === "fail") {
                formik.errors.submit = res.message;
            } else {
                console.log("Is ok");
            }
        }
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                ADD Product<br/>
                <label htmlFor="name">Name </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                />

                <label htmlFor="tag">Tag </label>
                <input
                    id="tag"
                    name="tag"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.tag}
                    size="50"
                />

                <button type="submit">Submit</button>
                {formik.errors.submit ? <div className="Error">{formik.errors.submit}</div> : <br/>}
            </form>
        </div>
    );
}

export default ProductForm;