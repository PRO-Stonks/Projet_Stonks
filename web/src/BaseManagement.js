/**
 * Abstract class BaseManagement
 * This class implements the base queries to add/get/getAll/update/sofDel/del
 * Stonks items.
 *
 * @class BaseManagement
 */
class BaseManagement{
    /**
     * The base url, where we fetch the queries
     */
    #baseURL;

    /**
     * Constructor
     *
     * @abstract
     * @param baseURL the base URL to fetch the queries
     */
    constructor(baseURL) {
        if (this.constructor === BaseManagement) {
            throw new Error("Abstract classes can't be instantiated.");
        } else {
            this.#baseURL = baseURL;
        }
    }

    /**
     * Add an item
     *
     * @param token the token to send with query (user auth)
     * @param data the data to add
     * @returns {Promise<any>}
     */
    async add(token, data) {
        try {
            const response = await fetch(
                this.#baseURL + "add",
                {
                    method: 'POST',
                    mode: 'cors',
                    cache: 'no-cache',
                    credentials: 'same-origin',
                    headers: {
                        'Authorization': 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    },
                    redirect: 'follow',
                    referrerPolicy: 'no-referrer',
                    body: JSON.stringify(data)
                }
            );
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Get an item
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the item
     * @returns {Promise<any>}
     */
    async get(token, id) {
        try {
            const response = await fetch(
                this.#baseURL + id,
                {
                    method: 'GET',
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
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Get all items
     *
     * @param token the token to send with query (user auth)
     * @returns {Promise<*>}
     */
    async getAll(token) {
        return this.get(token, "");
    }

    /**
     * Update an item
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the item
     * @param data the data to update
     * @returns {Promise<any>}
     */
    async update(token, id, data) {
        try {
            const response = await fetch(
                this.#baseURL + id,
                {
                method: 'PATCH',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                referrerPolicy: 'no-referrer',
                body: JSON.stringify(data)
            });
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Soft delete an item
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the item
     * @returns {Promise<any>}
     */
    async softDelete(token, id) {
        try {
            const response = await fetch(
                this.#baseURL + id,
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
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Hard delete an item
     *
     * @param token the token to send with query (user auth)
     * @param id mongo _id of the item
     * @returns {Promise<any>}
     */
    async delete(token, id) {
        try {
            const response = await fetch(
                this.#baseURL + "hardDel/" + id,
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
            return response.json();
        } catch (e) {
            console.log(e);
        }
    }
}

export default BaseManagement;