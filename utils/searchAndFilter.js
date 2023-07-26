exports.searchFilterCalculator = (
    searchTerm,
    SearchableFields,
    andFilters,
    orFilters,
    /* no need these two fields if tags field only look tags field in data base. should pass if tags will look for multiple fields */
    // tags = [],
    // tagSearchableFields = [],
    defaultFindCondition = []
) => {
    const andConditions = [];
    // for search term
    if (searchTerm) {
        andConditions.push({
            $or: SearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    }

    /*  if (searchTerm) {
        orConditions.push(
            ...SearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            }))
        );
    } */
    // for or filters like checkbox, tags('skills', 'location', 'tags')
    if (Object.keys(orFilters).length) {
        Object.entries(orFilters).forEach(([field, value]) => {
            andConditions.push({
                $or: [
                    {
                        [field]: { $in: value },
                    },
                ],
            });
        });
    }

    /* no need these  if tags field only look tags field in data base. should pass if tags will look for multiple fields */
    // const tagsArray = Array.isArray(tags) ? tags : [tags];

    // if (tagsArray.length && tagSearchableFields.length) {
    //     const tagConditions = tagsArray.map((tag) =>
    //         tagSearchableFields.map((field) =>
    //             // Use $in for publicationYear, $regex for other fields
    //             field === 'skills'
    //                 ? { [field]: { $in: [tag] } }
    //                 : { [field]: { $regex: tag, $options: 'i' } }
    //         )
    //     );
    //     const flattenedTagConditions = tagConditions.flat();
    //     andConditions.push({ $or: flattenedTagConditions });
    // }

    // if (orConditions.length) {
    //     andConditions.push({
    //         $or: [...orConditions],
    //     });
    // }
    // default condition
    if (Object.keys(defaultFindCondition).length) {
        andConditions.push({
            $or: [...defaultFindCondition.$or],
        });
    }
    // and condition filter('jobStatus',and if any more,  should be added on FilterableFields )
    if (Object.keys(andFilters).length) {
        andConditions.push({
            $and: Object.entries(andFilters).map(([field, value]) => ({
                [field]: value,
            })),
        });
    }
    // if (Object.keys(filtersData).length) {
    //   andConditions.push(
    //     ...Object.entries(filtersData).map(([field, value]) => {
    //       if (field === 'maxPrice' || field === 'minPrice') {
    //         const operator = field === 'maxPrice' ? '$lte' : '$gte';
    //         return {
    //           price: { [operator]: value },
    //         };
    //       }
    //       return {
    //         [field]: {
    //           $regex: value,
    //           $options: 'i',
    //         },
    //       };
    //     })
    //   );
    // }

    // if (Object.keys(filtersData).length) {
    //     andConditions.push(
    //         ...Object.entries(filtersData).map(([field, value]) => {
    //             if (field === 'publicationYear') {
    //                 const year = value.toString();
    //                 const startDate = new Date(`${year}-01-01T00:00:00Z`);
    //                 const endDate = new Date(`${year}-12-31T23:59:59Z`);
    //                 return {
    //                     publicationDate: {
    //                         $gte: startDate,
    //                         $lte: endDate,
    //                     },
    //                 };
    //             }
    //             return {
    //                 [field]: {
    //                     $regex: value,
    //                     $options: 'i',
    //                 },
    //             };
    //         })
    //     );
    // }

    const whereConditions =
        andConditions.length > 0 ? { $and: andConditions } : defaultFindCondition;
    console.log(
        '🌼 🔥🔥 file: searchAndFilter.js:132 🔥🔥 whereConditions🌼',
        JSON.stringify(whereConditions)
    );
    return whereConditions;
};

//
const x = {
    $and: [
        {
            $or: [
                { title: { $regex: 'App', $options: 'i' } },
                { description: { $regex: 'App', $options: 'i' } },
            ],
        },
        { $or: [{ skills: { $in: ['Python', 'Java'] } }] },
        { $or: [{ location: { $in: ['Remote', 'Rajshahi'] } }] },
        { $or: [{ tags: { $in: ['role', 'issue', 'php'] } }] },
        {
            $or: [
                { applicationRequest: { $exists: false } },
                { applicationRequest: { $size: 0 } },
                {
                    applicationRequest: {
                        $not: { $elemMatch: { applicantsEmail: 'biyimo857r6@dicopto.com' } },
                    },
                },
            ],
        },
        { $and: [{ jobStatus: 'active' }, { categoryName: 'Internship' }] },
    ],
};
const y = {
    $and: [
        {
            $or: [
                { applicationRequest: { $exists: false } },
                { applicationRequest: { $size: 0 } },
                {
                    applicationRequest: {
                        $not: { $elemMatch: { applicantsEmail: 'lopep37307@muzitp.com' } },
                    },
                },
            ],
        },
    ],
};
