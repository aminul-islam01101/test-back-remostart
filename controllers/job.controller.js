const mongoose = require('mongoose');
const Category = require('../models/category.schema');
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

module.exports = {
    getCategories,
    createJob,
    getUsersJobs,
    deleteUsersJob,
    getAllJobs,
    insertApplication,
    acceptApplication,
    rejectApplication,
    getStatus,
};
// module.exports = { getCategories, publicJob, privateJob, internship, contracts };
