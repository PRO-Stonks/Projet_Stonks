'use strict';

let validator = (schema) =>
    (payload) => {

        let {error} = schema.validate(payload, {abortEarly: false,});
        if (error) {
            let message = error.details.map(el => el.message).join('\n');
            return {
                error: message,
            };
        }
        return true;
    };

module.exports = validator;