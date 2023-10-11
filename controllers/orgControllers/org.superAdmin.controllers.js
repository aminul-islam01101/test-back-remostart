const { UserJobsModel } = require('../../models/job.schema');
const orgUser = require('../../models/orgModels/org.usr.schema');
const Startup = require('../../models/startup.schema');

module.exports = {
    getAllStartups: async (req, res) => {
        try {
            // const pipeline = [
            //     {
            //         $lookup: {
            //             from: 'userJobs',
            //             localField: 'email',
            //             foreignField: 'email',
            //             as: 'userJobs',
            //         },
            //     },
            //     {
            //         $addFields: {
            //             jobCount: { $size: '$userJobs.jobs' },
            //         },
            //     },
            //     {
            //         $replaceRoot: {
            //             newRoot: { $mergeObjects: ['$$ROOT', { jobCount: '$jobCount' }] },
            //         },
            //     },
            // ];

            const pipeline = [
                {
                    $lookup: {
                        from: 'userjobs', // Name of the userjobs collection
                        localField: 'email',
                        foreignField: 'email',
                        as: 'userJobs',
                    },
                },
                {
                    $project: {
                        email: 1,
                        startupName: 1,
                        fullName: 1,
                        registrationData: 1,
                        verificationRequest: 1,
                        verificationStatus: 1,
                        blocked: 1,
                        jobCount: { $size: '$userJobs.jobs' }, // Calculate the job count
                        // Include other startup fields as needed
                    },
                },
            ];

            const startups = await Startup.aggregate(pipeline);
            // const totalJobCount = await UserJobsModel.findOne({email:start})
            res.send(startups);
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:9 🔥🔥 getAllStartups: 🔥🔥 error🌼',
                error
            );
        }
    },
    getAllMembers: async (req, res) => {
        try {
            const members = await orgUser.find({ role: { $ne: 'super_admin' } });

            res.status(200).json({
                status: 'success',
                data: members,
            });
        } catch (error) {
            console.log(
                '🌼 🔥🔥 file: org.superAdmin.controllers.js:66 🔥🔥 getAllMembers: 🔥🔥 error🌼',
                error
            );
        }
    },
};
