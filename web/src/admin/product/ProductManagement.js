import API_URL from "../../URL";
import BaseManagement from "../../BaseManagement";

class ProductManagement extends BaseManagement {

    constructor() {
        super(API_URL + "products/");
    }

    async add(token, data) {
        return super.add(token, data);
    }

    async get(token, id) {
        return super.get(token, id);
    }

    async getAll(token) {
        return super.getAll(token);
    }

    async update(token, id, data) {
        return super.update(token, id, data);
    }
}

export default ProductManagement;