exports.calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;

    const sortBy = options.sortBy || 'timestamp';
    const sortOrder = options.sortOrder || 'desc';

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.sortConditionSetter = (sortBy, sortOrder) => {
    const sortConditions = {};

    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    return sortConditions;
};
