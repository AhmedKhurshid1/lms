const { capitalize } = require('../libraries/common');

const multipleEvents = (query) => {
    let { skip = 0, limit = 8, ...data } = query;

    data = data || {};

    const pipeline = [
        {
            $match: {
                ...data,
                isDeleted: false,
            }
        },
        {
            $skip: +skip * +limit
        },
        {
            $limit: +limit
        },
        {
            $project: {
                password: 0,
                isCustom: 0,
                isInActive: 0,
                isDeleted: 0,
                createdAt: 0,
                updatedAt: 0,
            }
        }
    ];

    return pipeline;
}

module.exports = {
    multipleEvents
}