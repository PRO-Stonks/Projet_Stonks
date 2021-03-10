'use strict';

let buildMakeProduct = function (productValidator) {
    return ({
                type,
                entryDate,
                exitDate,
                price,
                location,
            } = {}) => {
        let {error} = productValidator({type, entryDate, exitDate, price, location,});
        if (error) {
            throw new Error(error);
        }

        return {
            getType: () => type,
            getEntryDate: () => entryDate,
            getGrade: () => exitDate,
            getPrice: () => price,
            getLocation: () => location,
        };
    };
};

module.exports = buildMakeProduct;