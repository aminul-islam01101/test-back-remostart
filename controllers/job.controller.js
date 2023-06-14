const mongoose = require('mongoose');
const Category = require('../models/category.schema');
const backBlazeSingle = require('../configs/backBlazeSingle');
// const Job = require('../models/jobs-Models/job.schema');
// const { PublicJob, PrivateJob, Internship } = require('../models/jobs-Models/job.schema');
// const PrivateJob = require('../models/jobs-Models/privateJob.schema');

const { UserJobsModel, jobPostData, JobDataModel } = require('../models/jobs-Models/job.schema');
const Remoforce = require('../models/remoForce.schema');
const Startup = require('../models/startup.schema');

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
    const { email } = req.params;
    try {
        const jobs = await JobDataModel.find({
            $or: [
                { applicationRequest: { $exists: false } },
                { applicationRequest: { $size: 0 } },
                {
                    applicationRequest: {
                        $not: { $elemMatch: { applicantsEmail: email } },
                    },
                },
            ],
        }).exec();
        res.status(200).json(jobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// get all jobs
const allAppliedJobs = async (req, res) => {
    const { email } = req.params;
    try {
        const remoforce = await Remoforce.findOne({
            email,
        });
        const appliedJobs = remoforce?.allApplications || [];
        res.status(200).json(appliedJobs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// const getAllJobs = async (req, res) => {
//     try {
//         const jobs = await JobDataModel.find();
//         res.status(200).json(jobs);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

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
        const {
            applicantsName,
            applicantsEmail,
            applicationStatus,
            email,
            country,
            title,
            startupsProfilePhoto,
            startupsName,
            type,
            stage,
            status,
            jobType,
        } = req.body;
        const applicationData = {
            applicantsName,
            applicantsEmail,
            applicationStatus,
            startupsEmail: email,
            jobId,
            country,
            title,
            startupsProfilePhoto,
            startupsName,
        };
        const startupNotificationObject = {
            jobId,
            startupsEmail: email,

            startupName: startupsName,
            remoforceName: applicantsName,
            remoforceEmail: applicantsEmail,
            jobTitle: title,
            type,
            stage,
            status,
            jobType,
        };

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
                'jobs.$[job].applicationRequest': applicationData,
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
                applicationRequest: applicationData,
            },
        };
        const optionsJobData = { upsert: true };
        await JobDataModel.updateOne(filterJobData, updateJobData, optionsJobData).session(session);

        // updating remoforce also
        const remoforce = await Remoforce.findOne({ email: applicantsEmail }).session(session);
        if (!remoforce.allApplications || remoforce.allApplications.length === 0) {
            remoforce.allApplications = [];
            remoforce.allApplications.push(applicationData);
        } else {
            const existingApplication = remoforce.allApplications.find(
                (application) =>
                    application.jobId === jobId && application.applicantsEmail === applicantsEmail
            );

            if (!existingApplication) {
                remoforce.allApplications.push(applicationData);
            }
        }
        await remoforce.save({ session });
        // updating notification
        const startup = await Startup.findOne({ email }).session(session);
        if (!startup.notifications) {
            startup.notifications = [];
            startup.notifications.push(startupNotificationObject);
        } else {
            const alreadyExist = startup.notifications.find(
                (request) =>
                    request.remoforceEmail === startupNotificationObject.remoforceEmail &&
                    request.jobId === startupNotificationObject.jobId &&
                    request.type === startupNotificationObject.type &&
                    request.stage === startupNotificationObject.stage
            );
            if (!alreadyExist) {
                startup.notifications.push(startupNotificationObject);
            }
        }
        await startup.save({ session });
        await session.commitTransaction();
        res.status(200).send({
          message: 'Application request inserted successfully',
          data:  startup.notifications
        });
        
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
    const {
        email,
        jobId,
        applicantsEmail,
        remoforceName,
        startupsName,
        jobTitle,
        type,
        stage,
        notificationStatus,
    } = req.body;
    const status = 'rejected';

    const remoforceNotificationObject = {
        jobId,
        startupsEmail: email,
        startupName: startupsName,
        remoforceName,
        remoforceEmail: applicantsEmail,
        jobTitle,
        type,
        stage,
        status: notificationStatus,
    };

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
        const remoforce = await Remoforce.findOne({ email: applicantsEmail });
        const applicationToUpdate = remoforce.allApplications.find(
            (application) => application.jobId === jobId
        );

        applicationToUpdate.applicationStatus = status;

        if (!remoforce.notifications) {
            remoforce.notifications = [];
            remoforce.notifications.push(remoforceNotificationObject);
        } else {
            const alreadyExist = remoforce.notifications.find(
                (request) =>
                    request.remoforceEmail === remoforceNotificationObject.remoforceEmail &&
                    request.jobId === remoforceNotificationObject.jobId &&
                    request.type === remoforceNotificationObject.type &&
                    request.stage === remoforceNotificationObject.stage
            );
            if (!alreadyExist) {
                remoforce.notifications.push(remoforceNotificationObject);
            }
        }
        await remoforce.save();

        res.status(200).send({
            message: 'Application request rejected',
            data:  remoforce.notifications
          });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};
const acceptApplication = async (req, res) => {
    const { id } = req.params;
    const {
        email,
        jobId,
        applicantsEmail,
        status,
        remoforceName,
        startupsName,
        jobTitle,
        type,
        stage,
        notificationStatus,
    } = req.body;

    const remoforceNotificationObject = {
        jobId,
        startupsEmail: email,
        startupName: startupsName,
        remoforceName,
        remoforceEmail: applicantsEmail,
        jobTitle,
        type,
        stage,
        status: notificationStatus,
    };

    try {
        // Find the job post by ID
        const jobPost = await JobDataModel.findById(jobId);
        if (!jobPost) {
            return res.status(404).send('Job post not found');
        }
        console.log({ jobPost });
        // Update the application request's status to "accepted"
        const applicationRequestIndex = jobPost.applicationRequest.findIndex(
            (request) => request.applicantsEmail === applicantsEmail
        );
        if (applicationRequestIndex < 0) {
            return res.status(404).send('Application request not found');
        }
        jobPost.applicationRequest[applicationRequestIndex].applicationStatus = status;

      

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

        const remoforce = await Remoforce.findOne({ email: applicantsEmail });
        const applicationToUpdate = remoforce.allApplications.find(
            (application) => application.jobId === jobId
        );

        applicationToUpdate.applicationStatus = status;

        // updating notification

        if (!remoforce.notifications) {
            remoforce.notifications = [];
            remoforce.notifications.push(remoforceNotificationObject);
        } else {
            const alreadyExist = remoforce.notifications.find(
                (request) =>
                    request.remoforceEmail === remoforceNotificationObject.remoforceEmail &&
                    request.jobId === remoforceNotificationObject.jobId &&
                    request.type === remoforceNotificationObject.type &&
                    request.stage === remoforceNotificationObject.stage
            );
            if (!alreadyExist) {
                remoforce.notifications.push(remoforceNotificationObject);
            }
        }
        await remoforce.save();
        res.status(200).send({
            message: `${status==='accepted' ? 'Application accepted successfully' : 'Application Application request accepted '}`,
            data:  remoforce.notifications
          });
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

        const remoforce = await Remoforce.findOne({ email });
        const country = remoforce?.personalDetails?.country || 'Not Provided';
        const job = await JobDataModel.findById(jobId).exec();

        if (!job) {
            // If the job is not found, return an error response
            return res.status(404).json({ error: 'Job not found' });
        }
        if (job.applicationRequest.length === 0) {
            return res.send({ status: 'notApplied', country, jobDetails: job });
        }

        // Get the application request for the current user (based on their email)
        const applicationRequest = job?.applicationRequest?.find(
            (request) => request.applicantsEmail === email
        );

        console.log(applicationRequest);

        if (!applicationRequest) {
            // If there is no application request for the current user, return an error response
            return res.send({ status: 'notApplied', country, jobDetails: job });
        }

        // Return the application status for the current user
        return res.json({ status: applicationRequest.applicationStatus, country, jobDetails: job });
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
const createInterviewSchedule = async (req, res) => {
    const {
        applicantsEmail,
        jobId,
        startupsEmail,
        interviewStatus,
        scheduleDetails,
        startupsName,
        applicantsName,
        jobTitle,
        type,
        stage,
        status,
    } = req.body;

    const remoforceNotificationObject = {
        jobId,
        startupsEmail,
        startupName: startupsName,
        remoforceName: applicantsName,
        remoforceEmail: applicantsEmail,
        jobTitle,
        type,
        stage,
        status,
    };

    // res.send('route ok')
    console.log(jobId.yellow.bold);

    try {
        // Find the job post by ID
        const job = await JobDataModel.findById(jobId);
        if (!job) {
            return res.status(404).send('Job post not found');
        }
        const jobToUpdate = job.applicationRequest.find(
            (request) => request.applicantsEmail === applicantsEmail
        );
        jobToUpdate.interviewSchedule = scheduleDetails;
        jobToUpdate.applicationStatus = interviewStatus;
        // Update the application request's status to "accepted"
        await job.save();
        // Update the user's job posts as well
        const userJobPosts = await UserJobsModel.findOne({ email: startupsEmail });
        if (!userJobPosts) {
            return res.status(404).send('Job post not found');
        }
        const jobsToUpdate = userJobPosts.jobs.find((post) => post.jobId === jobId);
        jobsToUpdate.interviewSchedule = scheduleDetails;
        jobsToUpdate.applicationStatus = interviewStatus;

        await userJobPosts.save();

        // Update the remoforce all application posts as well
        const remoforce = await Remoforce.findOne({ email: applicantsEmail });

        const applicationToUpdate = remoforce.allApplications.find(
            (application) => application.jobId === jobId
        );
        console.log(remoforce);
        applicationToUpdate.interviewSchedule = scheduleDetails;
        applicationToUpdate.applicationStatus = interviewStatus;

        if (!remoforce.notifications) {
            remoforce.notifications = [];
            remoforce.notifications.push(remoforceNotificationObject);
        } else {
            const alreadyExist = remoforce.notifications.find(
                (request) =>
                    request.remoforceEmail === remoforceNotificationObject.remoforceEmail &&
                    request.jobId === remoforceNotificationObject.jobId &&
                    request.type === remoforceNotificationObject.type &&
                    request.stage === remoforceNotificationObject.stage
            );
            if (!alreadyExist) {
                remoforce.notifications.push(remoforceNotificationObject);
            }
        }
        await remoforce.save();

        res.status(200).send({
            message: 'Event creation successful.Pls check your calender',
            data:  remoforce.notifications
          });
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
    createInterviewSchedule,
    allAppliedJobs,
};
// module.exports = { getCategories, publicJob, privateJob, internship, contracts };
