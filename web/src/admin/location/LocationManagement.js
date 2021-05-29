import API_URL from "../../utils/URL";
import BaseManagement from "../../utils/BaseManagement";

/**
 * Management specific to Locations
 *
 * @class LocationManagement
 */
class LocationManagement extends BaseManagement {

    /**
     * Constructor
     */
    constructor() {
        super(API_URL + "locations/");
    }

    /**
     * Add a Location
     *
     * @param token the token to send with query (user auth)
     * @param data the data corresponding to Location model to add
     * @returns {Promise<*>}
     */
    async add(token, data) {
        return super.add(token, data);
    }

    /**
     * Get a Location
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Location
     * @returns {Promise<*>}
     */
    async get(token, id) {
        return super.get(token, id);
    }

    /**
     * Get all Location
     *
     * @param token the token to send with query (user auth)
     * @param queryString the string query to paginate / limit => ex: ?page=2&limit=20
     * @returns {Promise<*>}
     */
    async getAll(token, queryString) {
        return super.getAll(token, queryString);
    }

    /**
     * Update a Location
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Location
     * @param data the data corresponding to Location model to update
     * @returns {Promise<*>}
     */
    async update(token, id, data) {
        return super.update(token, id, data);
    }

    /**
     * Soft delete a Location
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Location
     * @returns {Promise<*>} the code status response
     */
    async softDelete(token, id) {
        return super.softDelete(token, id);
    }

    /**
     * Hard delete a Location
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the Location
     * @returns {Promise<*>} the code status response
     */
    async delete(token, id) {
        return super.delete(token, id);
    }
}

export default LocationManagement;