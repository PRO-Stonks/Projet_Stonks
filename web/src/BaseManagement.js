/**
 * Abstract class BaseManagement
 *
 * @class BaseManagement
 */
class BaseManagement{
    #baseURL;

    constructor(baseURL) {
        if (this.constructor === BaseManagement) {
            throw new Error("Abstract classes can't be instantiated.");
        } else {
            this.#baseURL = baseURL;
        }
    }

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

    async getAll(token) {
        return this.get("", token);
    }

    async update(token, id, data) {
        try {
            const response = await fetch(
                this.#baseURL + id,
                {
                method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
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
}

export default BaseManagement;