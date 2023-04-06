const mongoose = require('mongoose');
const { jobPostData } = require('./jobs-Models/job.schema');
/* eslint-disable new-cap */

const categorySchema = mongoose.Schema({
    categoryImage: {
        type: String,
    },

    categoryName: {
        type: String,
    },
    description: {
        type: String,
    },
    jobs: [
        {
            jobId: {
                type: String,
            },
            ...jobPostData.obj,
        },
    ],
});
const Category = new mongoose.model('category', categorySchema);

module.exports = Category;
