/* eslint-disable new-cap */
const mongoose = require('mongoose');
const allValidator = require('validator');
const { applicationRequestSchema, notificationSchema } = require('./job.schema');



const remoforceSchema = mongoose.Schema({
    fullName: {
        type: String,
        // required: [true, 'Please provide User name'],
    },

    // email: {
    //     type: String,
    //     required: [true, 'Please provide a unique email'],
    //     unique: true,
    // },

    // personalPhone: {
    //     type: Number,
    //     required: [true, 'Please provide a valid phone number'],
    // },
    personalPhone: {
        type: String,
        // required: true,
        trim: true,
        // validate: {
        //     validator: allValidator.isMobilePhone,
        //     message: (props) => `${props.value} is not valid mobile number`,
        // },
    },
    email: {
        type: String,
        // required: true,
        unique: true,

        // validate: {
        //     validator: allValidator.isEmail,
        //     message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        // },
        trim: true,
    },
    // update profile settings---------------------

    personalDetails: {
        bio: {
            type: String,
        },
        aboutMe: {
            type: String,
        },
        age: {
            type: Number,
        },
        gender: {
            type: String,
        },
        birthDate: {
            type: Date,
        },
        country: {
            type: String,
        },
        alternativeEmail: {
            type: String,

            // validate: {
            //     validator: allValidator.isEmail,
            //     message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
            // },
            // trim: true,
        },
        alternativePhone: {
            type: String,
            // required: true,
            // trim: true,
            // validate: {
            //     validator: allValidator.isMobilePhone,
            //     message: (props) => `${props.value} is not valid mobile number`,
            // },
        },
    },
    socialLinks: {
        Github: String,
        Linkedin: String,
        Instagram: String,
        Twitter: String,
    },

    remoforceProfilePhoto: {
        type: String,
    },
    resume: {
        type: String,
    },

    // skill and job preference---------------------
    selectedSkills: [
        {
            skillName: String,
            level: {
                type: String,
                // enum: ['Beginner', 'Intermediate', 'Professional'],
            },
        },
    ],
    softSkills: [String],
    selectedLanguages: [
        {
            language: String,

            languageLevel: {
                type: String,

                enum: ['Native Language', 'Advance', 'Intermediate'],
            },
        },
    ],
    jobPreference: {
        jobType: {
            type: String,

            // enum: ['Shadowing', 'Public Job', 'Private Job', 'Internship', 'Gigs', 'Contract'],
        },
        jobIndustry: String,
        jobLevel: {
            type: String,

            enum: ['Beginner', 'Intermediate', 'Advance', 'Professional'],
        },
        locationPreference: {
            type: String,

            enum: ['Work from Home', 'Remote', 'Hybrid', 'Full Time'],
        },
    },
    // education settings---------------

    educationDetails: [
        {
            school: String,
            fieldOfStudy: String,
            startingDate: Date,
            endingDate: Date,
        },
    ],
    // experience settings---------------
    experienceDetails: [
        {
            companyName: { type: String },
            position: { type: String },
            startingDate: { type: Date },
            endingDate: { type: Date },
            type: { type: String },
        },
    ],
    projectDetails: [
        {
            startingDate: { type: Date },
            endingDate: { type: Date },
            projectName: { type: String },
            projectDescription: { type: String },
            projectLink: { type: String },
            projectType: { type: String },
        },
    ],
    allRequests: [
        {
            startupsEmail: { type: String },
            remoforceName: { type: String },
            startupName: { type: String },
            startupIcon: { type: String },
            searchQuery: { type: {} },
            interviewStatus: {
                type: String,
                enum: ['not requested', 'requested', 'accepted', 'rejected'],
            },
            interviewSchedule:{},
            jobId: { type: String },
            remoforceEmail:{ type: String },
            timestamp: {
                type: Date,
                default: Date.now, // Add a default value of the current date and time
              },
        },
    ],
    allApplications:[applicationRequestSchema],
    notifications:[notificationSchema],
    profileScore: {
        totalScore: {type: Number, default:0},
        profile: {type: Number, default:0},
        skill: {type: Number, default:0},
        education: {type: Number, default:0},
        experience: {type: Number, default:0},
        projects: {type: Number, default:0},
        accounts: {type: Number, default:0},
    },
    blocked: {
        type: Boolean,
        default: false, // Default value is set to false
      },
      verificationRequested: {
        type: Boolean,
        default: false, // Default value is set to false
      },
      verified: {
        type: Boolean,
        default: false, // Default value is set to false
      },
  
  
    timestamp: {
        type: Date,
        default: Date.now,
    },
});
const User = new mongoose.model('remoforce', remoforceSchema);

module.exports = User;
