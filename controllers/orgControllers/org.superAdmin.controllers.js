/* eslint-disable no-nested-ternary */
const { UserJobsModel } = require('../../models/job.schema');
const orgUser = require('../../models/orgModels/org.usr.schema');
const Startup = require('../../models/startup.schema');
const Remoforce = require('../../models/remoForce.schema');
const pick = require('../../utils/pick');
const { paginationFields } = require('../../utils/paginations/pagination.constants');
const {
    calculatePagination,
    sortConditionSetter,
} = require('../../utils/paginations/pagination.calculator');
const { searchFilterCalculator } = require('../../utils/searchAndFilter');

module.exports = {
    getAllStartups: async (req, res) => {
        const { modifier } = req.params;
        let filter = {};
        if (modifier === 'verified') {
            filter = {
                verificationStatus: true,
            };
        }
        if (modifier === 'blocked') {
            filter = {
                blocked: true,
            };
        }
        if (modifier === 'verification-requested') {
            filter = {
                verificationRequest: true,
            };
        }

        try {
            const jobFilterableFields = ['domains', 'searchTerm', 'tags', 'countries', 'jobCount'];
            const jobOrFields = ['skills', 'location', 'tags']; // tags and checkboxes(multiple field can be selected and all result(containing any of the selected field will be shown) )
            const jobSearchableFields = [
                'startupName',
                'fullName',
                'registrationData.city',
                'email',
            ];
            const jobTagSearchableFields = ['title', 'description', 'categoryName', 'skills'];

            // pick modifier
            const filters = pick(req.query, jobFilterableFields);

            const orFilter = pick(req.query, jobOrFields);
            const paginationOptions = pick(req.query, paginationFields);

            // arguments
            const { searchTerm, tags, jobCount, ...andFilters } = filters;

            const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

            const defaultFindCondition = {};

            const whereConditions = searchFilterCalculator(
                searchTerm,
                jobSearchableFields,
                andFilters,
                orFilter,
                defaultFindCondition
            );

            const pipeline = [
                {
                    $lookup: {
                        from: 'userjobs', // Name of the userjobs collection
                        localField: 'email',
                        foreignField: 'email',
                        as: 'userJobs',
                    },
                },
                { $match: { ...filter, ...whereConditions } },
                { $sort: { timestamp: sortOrder === 'asc' ? 1 : -1 } },
                {
                    $project: {
                        email: 1,
                        startupName: 1,
                        fullName: 1,
                        domains: 1,
                        registrationData: 1,
                        verificationRequest: 1,
                        verificationStatus: 1,
                        blocked: 1,
                        timestamp: 1,
                        jobCount: { $size: '$userJobs.jobs' }, // Calculate the job count
                        // Include other startup fields as needed
                    },
                },
            ];
            if (sortBy === 'jobCount') {
                pipeline.push({
                    $addFields: {
                        maxJobCount: { $max: '$jobCount' },
                    },
                });
                if (sortOrder === '1') {
                    pipeline.push({
                        $sort: { maxJobCount: 1 },
                    });
                } else {
                    pipeline.push({
                        $sort: { maxJobCount: -1 },
                    });
                }
            }

            const startups = await Startup.aggregate(pipeline).skip(skip).limit(limit);

            const total = await Startup.countDocuments({ ...filter, ...whereConditions });

            const jobs = {
                success: true,
                message: `${'Startup retrieved successfully !'}`,

                meta: {
                    page,
                    limit,
                    total,
                },
                data: startups,
            };
            res.status(200).json(jobs);
            // const totalJobCount = await UserJobsModel.findOne({email:start})
            // res.send(startups);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:9 🔥🔥 getAllStartups: 🔥🔥 error🌼',
                error
            );
        }
    },

    getAllRemoforce: async (req, res) => {
        const { modifier } = req.params;
        let filter = {};
        if (modifier === 'verified') {
            filter = {
                verified: true,
            };
        }
        if (modifier === 'blocked') {
            filter = {
                blocked: true,
            };
        }
        if (modifier === 'verification-requested') {
            filter = {
                verificationRequested: true,
            };
        }

        const jobFilterableFields = [
            'selectedSkills',
            'searchTerm',
            'tags',
            'location',
            'jobApplied',
            'level',
        ];
        const jobOrFields = ['tags'];

        // searchTerm is related to jobSearchableFields
        const jobSearchableFields = ['fullName', 'email'];

        // pick modifier
        const filters = pick(req.query, jobFilterableFields);

        const orFilter = pick(req.query, jobOrFields);

        const paginationOptions = pick(req.query, paginationFields);

        // arguments
        const { searchTerm, tags, jobApplied, ...andFilters } = filters;

        const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

        const whereConditions = searchFilterCalculator(
            searchTerm,
            jobSearchableFields,
            andFilters,
            orFilter
        );
        console.log(
            '🌼 🔥🔥 file: org.superAdmin.controllers.js:185 🔥🔥 getAllRemoforce: 🔥🔥 whereConditions🌼',
            whereConditions
        );

        const pipeline = [
            { $match: { ...filter, ...whereConditions } },
            { $sort: { timestamp: sortOrder === 'asc' ? 1 : -1 } },
        ];

        if (sortBy === 'applicationNos') {
            pipeline.push(
                {
                    $addFields: {
                        applicationNos: {
                            $cond: {
                                if: { $isArray: '$allApplications' },
                                then: { $size: '$allApplications' },
                                else: 0, // or any default value you prefer
                            },
                        },
                    },
                },
                {
                    $sort: {
                        applicationNos: +sortOrder,
                    },
                },
                {
                    $unset: 'applicationNos',
                }
            );
        }
        if (sortBy === 'requestNos') {
            pipeline.push({
                $addFields: {
                    requestNos: {
                        $cond: {
                            if: { $isArray: '$allRequests' },
                            then: { $size: '$allRequests' },
                            else: 0, // or any default value you prefer
                        },
                    },
                },
            });
            if (sortOrder === '1') {
                pipeline.push({
                    $sort: { requestNos: 1 },
                });
            } else {
                pipeline.push({
                    $sort: { requestNos: -1 },
                });
            }
        }

        try {
            const remoforce = await Remoforce.aggregate(pipeline)

                // .sort(sortConditions)
                .skip(skip)
                .limit(limit);

            const total = await Remoforce.countDocuments({ ...filter, ...whereConditions });

            const allRemoforce = {
                success: true,
                message: `${'all remoforce retrieved successfully !'}`,

                meta: {
                    page,
                    limit,
                    total,
                },
                data: remoforce,
            };
            res.status(200).json(allRemoforce);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:264 🔥🔥 getAllRemoforce: 🔥🔥 error🌼',
                error
            );
        }
    },
    getAllStartupFilters: async (req, res) => {
        const condition = {
            $or: [
                { domains: { $exists: true, $not: { $size: 0 } } },
                { 'registrationData.country': { $exists: true, $ne: '' } },
            ],
        };
        try {
            const startups = await Startup.aggregate([
                { $match: condition },
                { $unwind: '$domains' },

                {
                    $group: {
                        _id: null,
                        domains: { $addToSet: '$domains' },
                        countries: { $addToSet: '$registrationData.country' }, // Add $addToSet for registrationData.country
                    },
                },
                { $project: { _id: 0, domains: 1, countries: 1 } },
            ]);
            // const totalJobCount = await UserJobsModel.findOne({email:start})
            const finalResult = startups.length ? startups[0] : { domains: [], countries: [] };
            const transformedResult = {
                domains: finalResult.domains.map((domain) => ({ label: domain, value: domain })),
                countries: finalResult.countries.map((country) => ({
                    label: country,
                    value: country,
                })),
            };
            res.send(transformedResult);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:9 🔥🔥 getAllStartups: 🔥🔥 error🌼',
                error
            );
        }
    },
    getAllRemoFilters: async (req, res) => {
        const condition = {
            $or: [
                // { selectedSkills
                //     : { $exists: true, $not: { $size: 0 } } },
                { 'personalDetails.country': { $exists: true, $ne: '' } },
            ],
        };
        try {
            const remoforceFilters = await Remoforce.aggregate([
                { $match: condition },
                { $unwind: { path: '$selectedSkills', preserveNullAndEmptyArrays: false } }, // Unwind selectedSkills array
                {
                    $group: {
                        _id: null,
                        location: { $addToSet: '$personalDetails.country' },
                        skills: {
                            $addToSet: {
                                value: '$selectedSkills.skillName',
                                label: '$selectedSkills.skillName',
                            },
                        },
                        level: {
                            $addToSet: {
                                value: '$selectedSkills.level',
                                label: '$selectedSkills.level',
                            },
                        },
                    },
                },
                { $unwind: '$skills' },
                { $unwind: '$level' },
                { $unwind: '$location' },
                {
                    $group: {
                        _id: null,
                        location: { $addToSet: '$location' },
                        skills: { $addToSet: '$skills' },
                        level: { $addToSet: '$level' },
                    },
                },
                { $project: { _id: 0, skills: 1, location: 1, level: 1 } },
            ]);

            // const totalJobCount = await UserJobsModel.findOne({email:start})
            const finalResult = remoforceFilters.length
                ? remoforceFilters[0]
                : { skills: [], location: [], level: [] };
            const transformedResult = {
                skills: finalResult.skills.reduce((acc, skill) => acc.concat(skill), []),

                levels: finalResult.level.reduce((acc, level) => acc.concat(level), []),
                location: finalResult.location.map((country) => ({
                    label: country,
                    value: country,
                })),
            };
            res.send(transformedResult);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:9 🔥🔥 getAllStartups: 🔥🔥 error🌼',
                error
            );
        }
    },
    getAllMembers: async (req, res) => {
        const jobFilterableFields = ['domains', 'searchTerm', 'tags', 'role', 'jobCount'];
        const jobOrFields = ['skills', 'location', 'tags']; // tags and checkboxes(multiple field can be selected and all result(containing any of the selected field will be shown) )
        const jobSearchableFields = ['lastName', 'firstName', 'email'];

        // pick modifier
        const filters = pick(req.query, jobFilterableFields);

        const orFilter = pick(req.query, jobOrFields);
        const paginationOptions = pick(req.query, paginationFields);

        // arguments
        const { searchTerm, tags, jobCount, ...andFilters } = filters;

        const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

        const defaultFindCondition = {};
        const whereConditions = searchFilterCalculator(
            searchTerm,
            jobSearchableFields,
            andFilters,
            orFilter,
            defaultFindCondition
        );
        const filter = { role: { $ne: 'super_admin' } };
        try {
            const members = await orgUser
                .aggregate([
                    { $match: { ...filter, ...whereConditions } },
                    { $sort: { timestamp: sortOrder === 'asc' ? 1 : -1 } },
                ])
                .skip(skip)
                .limit(limit);

            const total = await orgUser.countDocuments({ ...filter, ...whereConditions });

            const jobs = {
                status: 'success',
                message: `${'team members retrieved successfully !'}`,

                meta: {
                    page,
                    limit,
                    total,
                },
                data: members,
            };
            res.status(200).json(jobs);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:66 🔥🔥 getAllMembers: 🔥🔥 error🌼',
                error
            );
        }
    },
    getAllTeamFilters: async (req, res) => {
        try {
            const teamFilters = await orgUser.aggregate([
                { $match: { role: { $ne: 'super_admin' } } },
                { $unwind: '$role' },
                {
                    $group: {
                        _id: null,
                        roles: { $addToSet: '$role' },
                    },
                },
                { $project: { _id: 0, roles: 1 } },
            ]);

            const finalResult = teamFilters.length ? teamFilters[0] : { roles: [] };
            const transformedResult = {
                roles: finalResult.roles.map((role) => ({
                    label: role,
                    value: role,
                })),
            };
            res.send(transformedResult);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:9 🔥🔥 getAllStartups: 🔥🔥 error🌼',
                error
            );
        }
    },
    deleteMember: async (req, res) => {
        const { email } = req.params;
        try {
            // Assuming `orgUser` is your Mongoose model
            const deletedMember = await orgUser.findOneAndDelete({ email });


            if (deletedMember) {
                // Member was found and deleted successfully
                res.status(200).json({ message: 'Member deleted successfully' });
            } else {
                // Member with the provided email was not found
                res.status(404).json({ message: 'Member not found' });
            }
        } catch (error) {
            // Handle any errors that occur during the delete operation
            console.error('Error deleting member:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};
//     domains: { $exists: true, $not: { $size: 0 } }
