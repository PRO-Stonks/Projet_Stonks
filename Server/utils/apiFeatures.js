/**
 * Utils features to manage query dynamically
 */
'use strict';

const AppError = require("./appError");

class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    /**
     * Sort query result according to parameter in query string
     * @returns {APIFeatures}
     */
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.query = this.query.sort(sortBy);
        }
        return this;
    }

    populate() {
        // -----/route?populateField=a,b,c&populateValue[a]=blue&populateValue[b]=red
        console.log("Request");
        if (this.queryString.populateField && this.queryString.populateValue) {
            console.log(this.queryString)
            const populateField = this.queryString.populateField.split(",");
            const populateValue = this.queryString.populateValue;
            populateField.forEach(field =>{
                if(! populateValue[field]){
                    throw new AppError(400,"fail", "populate field "+populateField+" has no value");
                }
                this.query = this.query.populate([{path: field, select: populateValue[field]}]);
            })
        }
        return this;
    }

    /**
     * Add options to paginate the result
     * @returns {APIFeatures}
     */
    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }

    // Field Limiting ex: -----/user?fields=name,email,address
    /**
     * Add options to restrict files to certain values
     * @returns {APIFeatures}
     */
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.query = this.query.select(fields);
        }
        return this;
    }
}

module.exports = APIFeatures;