import API_URL from "../../URL";
import BaseManagement from "../../BaseManagement";

/**
 * Management specific to Products
 *
 * @class ProductManagement
 */
class ProductManagement extends BaseManagement {

    /**
     * Constructor
     */
    constructor() {
        super(API_URL + "products/");
    }

    /**
     * Add a Product
     *
     * @param token the token to send with query (user auth)
     * @param data the data corresponding to Product model to add
     * @returns {Promise<*>}
     */
    async add(token, data) {
        return super.add(token, data);
    }

    /**
     * Get a Product
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Product
     * @returns {Promise<*>}
     */
    async get(token, id) {
        return super.get(token, id);
    }

    /**
     * Get all Products
     *
     * @param token the token to send with query (user auth)
     * @returns {Promise<*>}
     */
    async getAll(token) {
        return super.getAll(token);
    }

    /**
     * Update a Product
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Product
     * @param data the data corresponding to Product model to update
     * @returns {Promise<*>}
     */
    async update(token, id, data) {
        return super.update(token, id, data);
    }

    /**
     * Soft delete a Product
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Product
     * @returns {Promise<*>}
     */
    async softDelete(token, id) {
        return super.softDelete(token, id);
    }

    /**
     * Hard delete a Product
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Product
     * @returns {Promise<*>}
     */
    async delete(token, id) {
        return super.delete(token, id);
    }
}

export default ProductManagement;