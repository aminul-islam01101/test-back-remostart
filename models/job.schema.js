const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    jobId: {
        type: String,
    },
    startupsEmail: {
        type: String,
    },
    startupName: {
        type: String,
    },
    remoforceEmail: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    type: {
        type: String,
    },
    stage: {
        type: String,
    },
    status: {
        type: String,
    },
    remoforceName: {
        type: String,
    },
    jobType: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now, // Add a default value of the current date and time
    },
});

const applicationRequestSchema = mongoose.Schema({
    applicantsName: {
        type: String,
    },

    applicantsEmail: {
        type: String,
    },
    applicationStatus: {
        type: String,
    },
    startupsEmail: {
        type: String,
    },
    jobId: {
        type: String,
    },
    country: {
        type: String,
    },
    title: {
        type: String,
    },
    startupsProfilePhoto: {
        type: String,
    },
    startupsName: {
        type: String,
    },
    interviewSchedule: {},
    timestamp: {
        type: Date,
        default: Date.now, // Add a default value of the current date and time
    },
});
// This is for jobs collection
const jobPostData = mongoose.Schema({
    startupsProfilePhoto: String,
    startupsName: String,
    title: {
        type: String,
    },

    description: {
        type: String,
    },

    experience: Number,
    skills: {
        type: [String],
    },

    location: {
        type: String,
        default: 'Remote',
    },
    salary: {
        type: Number,
    },
    jobStatus: {
        type: String,
        enum: ['active', 'closed'],
    },

    email: String,

    categoryName: String,

    applyBefore: {
        type: Date,
    },
    startingDate: {
        type: Date,
    },
    curriculum: {
        type: String,
    },
    endingDate: {
        type: Date,
    },
    domains: {
        type: [String],
    },
    joiningPerks: {
        type: [String],
    },
    contractsPaper: {
        type: String,
    },
    mentorsInfo: { mentorsBio: String, mentorsName: String, mentorsLinkedInURL: String },
    applicationRequest: [applicationRequestSchema],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
// this is for userJobs Collection and category collection
const jobPostSchema = mongoose.Schema({
    email: String,
    jobs: [
        {
            jobId: {
                type: String,
            },
            applicationRequest: [applicationRequestSchema],
            ...jobPostData.obj,
        },
    ],
});

// const PublicJob = mongoose.model('job', jobPostSchema, 'publicJob');

const UserJobsModel = mongoose.model('userJobs', jobPostSchema);
const JobDataModel = mongoose.model('job', jobPostData);

module.exports = {
    UserJobsModel,
    applicationRequestSchema,
    jobPostData,
    JobDataModel,
    notificationSchema,
};
