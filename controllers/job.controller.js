const mongoose = require('mongoose');
const Category = require('../models/category.schema');
const backBlazeSingle = require('../configs/backBlazeSingle');
// const Job = require('../models/jobs-Models/job.schema');
// const { PublicJob, PrivateJob, Internship } = require('../models/jobs-Models/job.schema');
// const PrivateJob = require('../models/jobs-Models/privateJob.schema');

const { UserJobsModel, jobPostData, JobDataModel } = require('../models/jobs-Models/job.schema');

const getCategories = (req, res) => {
    Category.find({}, (err, data) => {
        if (err) {
            res.status(500).json({
                error: 'There was a server side error!',
            });
        } else {
            res.status(200).json({
                data,
                message: 'Success',
            });
        }
    });
};
// post a job

// const publicJob = async (req, res) => {
//     const { email, categoryName } = req.body;

//     try {
//         const newJob = new PublicJob(req.body);
//         await newJob
//             .save()
//             // .then((r) => console.log(r))
//             .then(async () => {
//                 // const category = await Category.findOne({ categoryName });
//                 const jobPost = { jobId: newJob._id, jobPosterEmail: email };

//                 const response = await Category.updateOne(
//                     { categoryName },
//                     { $push: { jobs: jobPost } }
//                 );
//                 res.send(response);
//             })
//             .catch((error) => {
//                 res.send({
//                     success: false,
//                     message: 'User is not created',
//                     error,
//                 });
//             });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
// const privateJob = async (req, res) => {
//     console.log(PrivateJob);
//     const { email, categoryName } = req.body;

//     try {
//         const newJob = new PrivateJob(req.body);
//         await newJob
//             .save()
//             // .then((r) => console.log(r))
//             .then(async () => {
//                 const jobPost = { jobId: newJob._id, jobPosterEmail: email };
//                 console.log(categoryName);
//                 //  console.log(category);

//                 const response = await Category.updateOne(
//                     { categoryName },
//                     { $push: { jobs: jobPost } },
//                     { upsert: true }
//                 );
//                 res.send(response);
//             })
//             .catch((error) => {
//                 res.send({
//                     success: false,
//                     message: 'User is not created',
//                     error,
//                 });
//             });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
// const internship = async (req, res) => {
//     console.log(Internship);
//     const { email, categoryName } = req.body;

//     try {
//         const newJob = new Internship(req.body);
//         await newJob
//             .save()
//             // .then((r) => console.log(r))
//             .then(async () => {
//                 const jobPost = { jobId: newJob._id, jobPosterEmail: email };
//                 console.log(categoryName);

//                 const response = await Category.updateOne(
//                     { categoryName },
//                     { $push: { jobs: jobPost } },
//                     { upsert: true }
//                 );
//                 res.send(response);
//             })
//             .catch((error) => {
//                 res.send({
//                     success: false,
//                     message: 'User is not created',
//                     error,
//                 });
//             });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
// const contracts = async (req, res) => {
//     // const obj = JSON.parse(req.body.obj);
//     console.log(JSON.parse(req.body.obj));

//     // obj.contractsPaper = req.file.filename;
//     // const { email, categoryName } = obj;

//     // try {
//     //     const newJob = new Internship(obj);
//     //     await newJob
//     //         .save()
//     //         // .then((r) => console.log(r))
//     //         .then(async () => {
//     //             const jobPost = { jobId: newJob._id, jobPosterEmail: email };
//     //             console.log(categoryName);

//     //             const response = await Category.updateOne(
//     //                 { categoryName },
//     //                 { $push: { jobs: jobPost } },
//     //                 { upsert: true }
//     //             );
//     //             res.send(response);
//     //         })
//     //         .catch((error) => {
//     //             res.send({
//     //                 success: false,
//     //                 message: 'User is not created',
//     //                 error,
//     //             });
//     //         });
//     // } catch (error) {
//     //     res.status(500).send(error.message);
//     // }
// };

// const createJob = async (req, res) => {
//     const { email, categoryName } = req.body;
//     try {
//         const newJob = new JobModel({
//             email,
//             jobs: [req.body],
//         });
//         await newJob
//             .save()
//             .then(async () => {
//                 const category = await Category.findOne({ categoryName });
//                 const jobPost = { jobId: newJob._id, ...req.body };
//                 // const jobPost = { jobId: newJob._id, jobPosterEmail: email };

//                 const response = await Category.updateOne(
//                     { categoryName },
//                     { $push: { jobs: jobPost } }
//                 );
//                 res.send(response);
//             })
//             .catch((error) => {
//                 res.send({
//                     success: false,
//                     message: 'User is not created',
//                     error,
//                 });
//             });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
const createJob = async (req, res) => {
    const { email, categoryName } = req.body;
    try {
        const newJob = new JobDataModel(req.body);
        await newJob
            .save()
            .then(async () => {
                const jobPost = await UserJobsModel.findOne({ email });
                console.log(newJob);

                if (jobPost) {
                    jobPost.jobs.push({ jobId: newJob._id, ...req.body });
                    await jobPost.save();
                } else {
                    const newJobPost = new UserJobsModel({
                        email,
                        jobs: [{ jobId: newJob._id, ...req.body }],
                    });
                    await newJobPost.save();
                }

                const categoryJobPost = { jobId: newJob._id, ...req.body };
                // const jobPost = { jobId: newJob._id, jobPosterEmail: email };

                const response = await Category.updateOne(
                    { categoryName },
                    { $push: { jobs: categoryJobPost } }
                );
                res.send(response);
            })
            .catch((error) => {
                res.send({
                    success: false,
                    message: 'User is not created',
                    error,
                });
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
// post a contracts Job
const contractsJob = async (req, res) => {
    const obj = JSON.parse(req.body.obj);
    const { email, categoryName } = obj;
    console.log('categoryName---- ', categoryName);

    if (req.files.contractsPaper.length) {
        const url = await backBlazeSingle(req.files.contractsPaper[0]);
        console.log(url);

        obj.contractsPaper = url;
    }
    console.log(obj);
    // res.send('route ok')
    try {
        const newJob = new JobDataModel(obj);
        await newJob
            .save()
            .then(async () => {
                const jobPost = await UserJobsModel.findOne({ email });

                if (jobPost) {
                    jobPost.jobs.push({ jobId: newJob._id, ...obj });
                    await jobPost.save();
                } else {
                    const newJobPost = new UserJobsModel({
                        email,
                        jobs: [{ jobId: newJob._id, ...obj }],
                    });
                    await newJobPost.save();
                }

                const categoryJobPost = { jobId: newJob._id, ...obj };
                // const jobPost = { jobId: newJob._id, jobPosterEmail: email };
                console.log('categoryJobPost----', categoryJobPost);

                const response = await Category.updateOne(
                    { categoryName },
                    { $push: { jobs: categoryJobPost } }
                );

                res.send(newJob);
            })
            .catch((error) => {
                res.send({
                    success: false,
                    message: 'User is not created',
                    error,
                });
            });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// edit contracts job
const editContractsJob = async (req, res) => {
    const { id } = req.params;

    const obj = JSON.parse(req.body.obj);
    const { email, categoryName } = obj;

    if (req.files?.contractsPaper?.length) {
        const url = await backBlazeSingle(req.files.contractsPaper[0]);
        console.log(url);

        obj.contractsPaper = url;
    }

    try {
        const updatedJob = await JobDataModel.findByIdAndUpdate(id, obj, {
            new: true, // Return the updated document
        });
        const existing = await UserJobsModel.findOne({ email });
        const existingJob = existing.jobs.find((job) => job.jobId === id);
        let option = {};
        if (req.files?.contractsPaper?.length) {
            option = { ...obj, jobId: id };
        } else {
            option = { ...obj, jobId: id, contractsPaper: existingJob.contractsPaper };
        }

        const updatedJobPost = await UserJobsModel.findOneAndUpdate(
            { email, 'jobs.jobId': id },
            { $set: { 'jobs.$': option } }
        );
        const updatedCategory = await Category.findOneAndUpdate(
            { categoryName, 'jobs.jobId': id },
            { $set: { 'jobs.$': obj } }
        );
        console.log('------------', updatedJob);

        res.send(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update job post' });
    }

    // res.send('route ok')
    // try {
    //     const newJob = new JobDataModel(obj);
    //     await newJob
    //         .save()
    //         .then(async () => {

    //             const jobPost = await UserJobsModel.findOne({ email });

    //             if (jobPost) {
    //                 jobPost.jobs.push({ jobId: newJob._id, ...obj });
    //                 await jobPost.save();
    //             } else {
    //                 const newJobPost = new UserJobsModel({
    //                     email,
    //                     jobs: [{ jobId: newJob._id, ...obj }],
    //                 });
    //                 await newJobPost.save();
    //             }

    //             const categoryJobPost = { jobId: newJob._id, ...obj };
    //             // const jobPost = { jobId: newJob._id, jobPosterEmail: email };
    //             console.log("categoryJobPost----", categoryJobPost);

    //             const response = await Category.updateOne(
    //                 { categoryName },
    //                 { $push: { jobs: categoryJobPost } }
    //             );

    //             res.send(newJob);

    //         })
    //         .catch((error) => {
    //             res.send({
    //                 success: false,
    //                 message: 'User is not created',
    //                 error,
    //             });
    //         });
    // } catch (error) {
    //     res.status(500).send(error.message);
    // }
};

// // Get Contracts job

// const getContractsJobs = async (req, res) => {
//     const { email } = req.params;

//     const user = await UserJobsModel.findOne({ email });

//     res.send(user?.jobs);
// };
// get all jobs of a specific user
const getUsersJobs = async (req, res) => {
    const { email } = req.params;

    const user = await UserJobsModel.findOne({ email });

    res.send(user?.jobs);
};
// get all jobs
const getAllJobs = async (req, res) => {
    try {
        const jobs = await JobDataModel.find();
        res.status(200).json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// GET category wise jobs
const getCategoryJobs = async (req, res) => {
    console.log(req.url);
    const categoryData = req.url.split('/').pop();
    const categoryName = categoryData.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    // res.send('route ok')

    try {
        const category = await Category.findOne({ categoryName });
        console.log(category.jobs);
        // res.send('route ok')
        res.status(200).json(category.jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// GET active jobs
const getUsersActiveJobs = async (req, res) => {
    const { email } = req.params;
    const jobStatus = req.url
        .split('/')
        .find((status) => status === 'active' || status === 'closed');

    try {
        const user = await UserJobsModel.findOne({ email });
        const activeJobs = user.jobs.filter((job) => job.jobStatus === jobStatus);

        // res.send('route ok')
        res.status(200).json(activeJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// GET active jobs
const getUsersShadowingJobs = async (req, res) => {
    const { email } = req.params;
    const jobCategory = req.url.split('/').find((category) => category === 'shadowing');
    const categoryName = jobCategory.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    try {
        const user = await UserJobsModel.findOne({ email });
        const shadowingJobs = user.jobs.filter((job) => job.categoryName === categoryName);

        // res.send('route ok')
        res.status(200).json(shadowingJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// delete a job of user
const deleteUsersJob = async (req, res) => {
    const { id } = req.params;
    const job = await JobDataModel.findById(id).exec();
    const { email, categoryName } = job;
    // const user = await UserJobsModel.findOne({ email });
    const result = await UserJobsModel.updateOne({ email }, { $pull: { jobs: { jobId: id } } });
    const resultCat = await Category.updateOne(
        { categoryName },
        { $pull: { jobs: { jobId: id } } }
    );
    const deleteJob = await JobDataModel.findByIdAndDelete(id);

    res.send(deleteJob);
};
// close a job of user
const closeUsersJob = async (req, res) => {
    const { id } = req.params;
    const job = await JobDataModel.findById(id).exec();

    console.log(id);

    const { email, categoryName } = job;
    console.log(email);

    // { categoryName, 'jobs.jobId': id },
    //         { $set: { 'jobs.$': obj } }
    // res.send('route ok')
    const userJobUpdate = await UserJobsModel.findOneAndUpdate(
        { email, 'jobs.jobId': id },
        { $set: { 'jobs.$.jobStatus': 'closed' } }
    ).exec();
    const userCategoryUpdate = await Category.findOneAndUpdate(
        { categoryName, 'jobs.jobId': id },
        { $set: { 'jobs.$.jobStatus': 'closed' } }
    ).exec();
    const updateJob = await JobDataModel.findByIdAndUpdate(
        id,
        { jobStatus: 'closed' },
        { new: true }
    );
    console.log(updateJob);

    res.send(updateJob);

    //     // const user = await UserJobsModel.findOne({ email });
    //     const result = await UserJobsModel.findOneAndUpdate(
    //         { email, 'jobs.jobId': id },
    //         { $set: { 'jobs.$': option } }
    //     );

    //     const resultCat = await Category.findOneAndUpdate(
    //         { categoryName, 'jobs.jobId': id },
    //         { $set: { 'jobs.$': option } }
    //     );
    //     const updateJob = await JobDataModel.findByIdAndUpdate(id,{jobStatus: 'closed'});

    //     res.send(updateJob);
};

// insert an application in UserJobsModel and JobDataModel

const insertApplication = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const jobId = req.params.id;
        const { applicantsName, applicantsEmail, applicationStatus, email } = req.body;

        // Check if the application request already exists in UserJobsModel
        const userJobs = await UserJobsModel.findOne(
            { 'jobs.jobId': jobId },
            { 'jobs.$': 1 }
        ).session(session);
        const existingRequestUserJobs = userJobs?.jobs[0].applicationRequest.find(
            (request) => request.applicantsEmail === applicantsEmail
        );
        if (existingRequestUserJobs) {
            return res.send('Application request already exists in UserJobsModel');
        }

        // Check if the application request already exists in JobDataModel
        const jobData = await JobDataModel.findById(jobId, { applicationRequest: 1 }).session(
            session
        );
        const existingRequestJobData = jobData?.applicationRequest.find(
            (request) => request.applicantsEmail === applicantsEmail
        );
        if (existingRequestJobData) {
            return res.send('Application request already exists in JobDataModel');
        }

        // Upsert application request in UserJobsModel
        const filterUserJobs = { 'jobs.jobId': jobId };
        const updateUserJobs = {
            $set: { email },
            $addToSet: {
                'jobs.$[job].applicationRequest': {
                    applicantsName,
                    applicantsEmail,
                    applicationStatus,
                },
            },
        };
        const optionsUserJobs = { upsert: true, arrayFilters: [{ 'job.jobId': jobId }] };
        await UserJobsModel.updateOne(filterUserJobs, updateUserJobs, optionsUserJobs).session(
            session
        );

        // Upsert application request in JobDataModel
        const filterJobData = { _id: jobId };
        const updateJobData = {
            $addToSet: {
                applicationRequest: { applicantsName, applicantsEmail, applicationStatus, email },
            },
        };
        const optionsJobData = { upsert: true };
        await JobDataModel.updateOne(filterJobData, updateJobData, optionsJobData).session(session);

        await session.commitTransaction();
        res.send('Application request upserted successfully');
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        res.status(500).send('Server error');
    } finally {
        session.endSession();
    }
};
// accept application
// delete a job of user
const rejectApplication = async (req, res) => {
    const { id } = req.params;
    const { status, email, jobId, applicantsEmail } = req.body;

    console.log(id, jobId);

    try {
        // Find the job post by ID
        const jobPost = await JobDataModel.findById(jobId);
        if (!jobPost) {
            return res.status(404).send('Job post not found');
        }

        // Update the application request's status to "accepted"
        const applicationRequestIndex = jobPost.applicationRequest.findIndex(
            (request) => request.applicantsEmail === applicantsEmail
        );
        if (applicationRequestIndex < 0) {
            return res.status(404).send('Application request not found');
        }
        jobPost.applicationRequest[applicationRequestIndex].applicationStatus = status;

        // Save the updated job post to the database
        await jobPost.save();

        // Update the user's job posts as well
        const userJobPosts = await UserJobsModel.findOne({ email });
        if (!userJobPosts) {
            return res.status(404).send('User not found');
        }
        const userJobPostIndex = userJobPosts.jobs.findIndex((post) => post.jobId === jobId);
        if (userJobPostIndex < 0) {
            return res.status(404).send('Job post not found in user jobs');
        }
        userJobPosts.jobs[userJobPostIndex].applicationRequest[
            applicationRequestIndex
        ].applicationStatus = status;
        await userJobPosts.save();

        res.send('Application request updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
const acceptApplication = async (req, res) => {
    const { id } = req.params;
    const { status, email, jobId, applicantsEmail } = req.body;

    console.log(id, jobId);

    try {
        // Find the job post by ID
        const jobPost = await JobDataModel.findById(jobId);
        if (!jobPost) {
            return res.status(404).send('Job post not found');
        }

        // Update the application request's status to "accepted"
        const applicationRequestIndex = jobPost.applicationRequest.findIndex(
            (request) => request.applicantsEmail === applicantsEmail
        );
        if (applicationRequestIndex < 0) {
            return res.status(404).send('Application request not found');
        }
        jobPost.applicationRequest[applicationRequestIndex].applicationStatus = status;

        // Save the updated job post to the database
        await jobPost.save();

        // Update the user's job posts as well
        const userJobPosts = await UserJobsModel.findOne({ email });
        if (!userJobPosts) {
            return res.status(404).send('User not found');
        }
        const userJobPostIndex = userJobPosts.jobs.findIndex((post) => post.jobId === jobId);
        if (userJobPostIndex < 0) {
            return res.status(404).send('Job post not found in user jobs');
        }
        userJobPosts.jobs[userJobPostIndex].applicationRequest[
            applicationRequestIndex
        ].applicationStatus = status;
        await userJobPosts.save();

        res.send('Application request updated');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
// getStatus of an applicant
const getStatus = async (req, res) => {
    const jobId = req.query.id; // get the id parameter from the request
    const { email } = req.query; // get the email parameter from the request

    try {
        // Find the job in the database by its id and email
        const job = await JobDataModel.findOne({
            _id: jobId,
        }).exec();

        if (!job) {
            // If the job is not found, return an error response
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.applicationRequest.length === 0) {
            return res.send({ status: 'notApplied' });
        }

        // Get the application request for the current user (based on their email)
        const applicationRequest = job?.applicationRequest?.find(
            (request) => request.applicantsEmail === email
        );

        console.log(applicationRequest);

        if (!applicationRequest) {
            // If there is no application request for the current user, return an error response
            return res.send({ status: 'notApplied' });
        }

        // Return the application status for the current user
        return res.json({ status: applicationRequest.applicationStatus });
    } catch (error) {
        // If there is an error while querying the database, return a generic error response
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
const applicationRequests = async (req, res) => {
    const { id } = req.params;

    console.log(id);
    // res.send('route ok')

    try {
        // Find the job post by ID
        const job = await JobDataModel.findById(id);
        if (!job) {
            return res.status(404).send('Job post not found');
        }

        // Update the application request's status to "accepted"

        res.send(job.applicationRequest);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

module.exports = {
    getCategories,
    createJob,
    contractsJob,
    getUsersJobs,
    deleteUsersJob,
    getAllJobs,
    insertApplication,
    acceptApplication,
    rejectApplication,
    getStatus,
    getCategoryJobs,
    getUsersActiveJobs,
    getUsersShadowingJobs,
    closeUsersJob,

    // getContractsJobs,
    editContractsJob,
    applicationRequests,
};
// module.exports = { getCategories, publicJob, privateJob, internship, contracts };
