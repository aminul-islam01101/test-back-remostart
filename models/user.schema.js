/* eslint-disable new-cap */
const mongoose = require('mongoose');
const allValidator = require('validator');

const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Please provide User name'],
    },

    // password: {
    //     type: String,
    //     required: [true, 'Please provide a password'],
    // },

    signInMethod: {
        type: String,
        // default:"email-password"
    },
    profilePhoto: String,

    password: {
        type: String,
        // required: [
        //     () => {
        //         if (this.signInMethod === 'google') return false;
        //         return true;
        //     },
        //     'Password is required',
        // ],
        trim: true,
    },

    personalPhone: {
        type: String,
        // required: true,
        trim: true,
        validate: {
            validator: allValidator.isMobilePhone,
            message: (props) => `${props.value} is not valid mobile number`,
        },
    },
    email: {
        type: String,
        required: true,

        validate: {
            validator: allValidator.isEmail,
            message: (props) => `${props.value} is not valid i.e. not like example@example.com`,
        },
        trim: true,
    },
    role: {
        type: String,
        enum: ['remoforce', 'startup', 'admin'],
        required: true,
    },
    ventureId: {
        type: String,
        required: true,
    },

    googleId: String,
    createdOn: {
        type: Date,
        default: Date.now,
    },
});
const User = new mongoose.model('user', userSchema);

module.exports = User;
