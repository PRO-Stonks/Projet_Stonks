/**
 * DELETE request of an element
 * @param url : path
 * @param token : user token
 * @returns {Promise<any>} : true if the element has been deleted, server response otherwise
 */
export default async function deleteElement(url, token) {
    try {
        const response = await fetch(url, {
            method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        });
        console.log(response.status)
        if (response.status === 204) {
            return true;
        } else {
            return response.json();
        }
    } catch (e) {
        console.log("Error")
        console.log(e);
    }
}

