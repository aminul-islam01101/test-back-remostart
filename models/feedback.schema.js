const mongoose = require('mongoose');
const { jobPostData } = require('./jobs-Models/job.schema');
/* eslint-disable new-cap */

const feedbackSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    timestamp: {
        type: Date,
        default: Date.now, // Add a default value of the current date and time
    },
});

feedbackSchema.pre('save', async function preSaveHook(next) {
    const Feedback = this.constructor;
    const isExist = await Feedback.findOne({
        email: this.email,
        message: this.message,
    });
    if (isExist) {
        throw new Error('failed');
    }
    next();
});
const Feedback = new mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;
