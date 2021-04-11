/**
 * Utils features to manage query dynamically
 */
'use strict';

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