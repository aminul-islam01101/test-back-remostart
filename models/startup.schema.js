/* eslint-disable new-cap */
const mongoose = require('mongoose');
const allValidator = require('validator');
const { notificationSchema } = require('./job.schema');

const { ObjectId } = mongoose.Types;

const talentsDataSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    scorePercentage: Number,
    skillLevel: String,
    country: String,
    interviewStatus: {
        type: String,
        enum: ['not requested', 'requested', 'accepted', 'rejected'],
    },
    interviewSchedule: {},
});
// const eventSchema =new mongoose.Schema()
const individualHistorySchema = new mongoose.Schema({
    searchQuery: {
        details: {
            description: String,
            title: String,
        },
        selectedLanguages: [String],
        locationPreference: [String],
        softSkills: [String],
        selectedSkills: [
            {
                skillName: String,
                level: String,
            },
        ],
        requiredTalents: Number,
    },
    events: [],
    requiredTalentsInHistory: [talentsDataSchema],
    timestamp: {
        type: Date,
        default: Date.now, // Add a default value of the current date and time
    },
});
const talentHistorySchema = new mongoose.Schema({
    transactionId: String,
    searchHistory: [individualHistorySchema],
});

const talentRequestHistorySchema = new mongoose.Schema({
    tierFREE: {
        type: [talentHistorySchema],
        default: [],
    },
    tierSTARTER: {
        type: [talentHistorySchema],
        default: [],
    },
    tierTEAM: {
        type: [talentHistorySchema],
        default: [],
    },
    tierBUSINESS: {
        type: [talentHistorySchema],
        default: [],
    },
});

const startupUserSchema = new mongoose.Schema({
    // Personal Info--------------------------------
    talentRequestHistory: {
        type: talentRequestHistorySchema,
        default: {},
    },

    fullName: {
        type: String,
        // required: [true, 'FullName is required'],
        trim: true,
        maxLength: 40,
        minLength: 3,
    },

    email: {
        type: String,
        // required: true,

        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },
    secondaryEmail: {
        type: String,

        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },

    personalPhone: {
        type: String,
        // required: true,
        trim: true,
        // validate: {
        //     validator: allValidator.isMobilePhone,
        //     message: (props) => `${props.value} is not valid mobile number`,
        // },
    },
    // professional Details------------------------------

    companyId: {
        type: Number,
        // required: true,
    },

    designation: {
        type: String,
        // required: true,
        maxLength: 50,
        minLength: 3,
    },

    officePhone: {
        type: String,
        // required: true,
        trim: true,
        validate: {
            validator: allValidator.isMobilePhone,
            message: (props) => `${props.value} is not valid mobile number`,
        },
    },
    linkedIn: {
        type: String,
        // required: true,
        trim: true,
        validate: {
            validator: allValidator.isURL,
            message: 'linkedin link is not valid',
        },
    },
    // Account credentials----------------------------------------

    companyEmail: {
        type: String,
        // required: true,
        // unique: true,
        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },
    // profile settings-------------------------------------

    startupIcon: {
        type: String,
        trim: true,
    },
    startupName: {
        type: String,
        maxLength: 100,
    },
    startupSlogan: {
        type: String,
        maxLength: 300,
    },
    startupDescription: {
        type: String,
        maxLength: 650,
    },
    worksIn: {
        type: String,
        maxLength: 650,
    },
    domains: {
        type: [String],
    },
    // homePageImages: [String],
    socialLinks: {
        Github: String,
        Linkedin: String,
        Instagram: String,
        Twitter: String,
    },
    //--------------------------------------------
    personalIds: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    // ------------------------------------- verification info

    registrationData: {
        registered: {
            type: Boolean,
        },
        place: String,
        city: {
            type: String,

            trim: true,
            maxlength: 50,
        },
        state: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        country: {
            type: String,
            trim: true,
            // required:[true,"country in address should be required"],
            maxlength: [50, 'No country name conatin more 50 words'],
        },
        // region: {
        //     type: String,
        //     trim: true,
        //     // required:[true,"country in address should be required"],
        //     maxlength: [50, 'No country name conatin more 50 words'],
        // },
        PIN: {
            type: Number,

            // validate :{
            //     validator: v =>{return allValidator.isPostalCode(new String(v))},
            //     message: 'PIN code is invalid',
            // }
        },

        incubatedAt: {
            type: String,
            maxlength: 60,
        },
        registrationDate: {
            type: Date,
            // required: [function () {return this.registered},"register date is required"],
        },
        registeredName: { type: String },
        registrationNumber: {
            type: String,
            // required: [function () {return this.registered},"CIN no. is required"],
            // validate:{
            //     validator: v =>{ return /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/.test(v)},
            //     message: props => `${props.value} is not a CIN number`
            // },// CIN Validation /^([LUu]{1})([0-9]{5})([A-Za-z]{2})([0-9]{4})([A-Za-z]{3})([0-9]{6})$/
        },
    },
    verificationRequest: Boolean,
    verificationStatus: Boolean,

    companyDocs: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },

    foundersDetail: {
        fullName: {
            type: String,

            trim: true,
            maxlength: 80,
            minlength: [3, 'Full name contain more than 3 letters'],
        },
        linkedin: {
            type: String,
            trim: true,

            validate: {
                validator: allValidator.isURL,
                message: 'Must be a Valid linkedin URL',
            },
        },
        address: {
            type: String,
            trim: true,
        },
    },
    talentRequestPaymentDetails: {
        id: ObjectId || null,
        tier: { type: String },
        transactionId: { type: String || null },
        searchLimit: { type: Number, default: 2 },
    },
    calenderTokens: {
        accessToken: { type: String },
        refreshToken: { type: String },
    },
    notifications: [notificationSchema],
    profileScore: {
        totalScore: { type: Number, default: 0 },
        profile: { type: Number, default: 0 },
        personnel: { type: Number, default: 0 },
        registration: { type: Number, default: 0 },
        founder: { type: Number, default: 0 },
    },
    //
    createdAt: {
        type: Date,
        immutable: true,
        default: () => Date.now(),
    },

    // updatedAt: {
    //     type: Date,
    //     default: () => Date.now(),
    // },
});

const Startup = new mongoose.model('startUp', startupUserSchema);

module.exports = Startup;
