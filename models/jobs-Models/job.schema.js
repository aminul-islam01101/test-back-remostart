const mongoose = require('mongoose');

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
});

const jobPostData = mongoose.Schema({
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

    email: String,

    categoryName: String,

    applyBefore: {
        type: Date,
    },
    startingDate: {
        type: Date,
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
    applicationRequest:[applicationRequestSchema], 
});
const jobPostSchema = mongoose.Schema({
    email: String,
    jobs: [
        {
            jobId: {
                type: String,
            },
            applicationRequest:[applicationRequestSchema],
            ...jobPostData.obj,
        },
    ],
});

// const PublicJob = mongoose.model('job', jobPostSchema, 'publicJob');

const UserJobsModel = mongoose.model('userJobs', jobPostSchema);
const JobDataModel = mongoose.model('job', jobPostData);

module.exports = { UserJobsModel, jobPostData, JobDataModel };


