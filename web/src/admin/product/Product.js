import {useFormik} from 'formik';
import ProductManagement from "./ProductManagement";


const Product = (props) => {

    const management = new ProductManagement();

    const formikAdd = useFormik({
        initialValues: {
            name: '',
            tag: ''
        },
        onSubmit: async (values) => {
            const res = await management.add(props.token, values);
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
            const res = await management.get(props.token, values.id);
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
            const res = await management.getAll(props.token);
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
            const res = await management.update(props.token, values.id,
                {name : values.name, tag: values.tag });
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

export default Product;