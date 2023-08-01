const mongoose = require('mongoose');

// Assuming you have a Mongoose model called JobDataModel
const JobDataModel = mongoose.model('JobDataModel');

const getApplicantData = async (email) => {
    try {
        const result = await JobDataModel.aggregate([
            // Match documents where "applicationRequest" array contains the specified email
            { $match: { 'applicationRequest.applicantsEmail': email } },
            // Unwind the "applicationRequest" array
            { $unwind: '$applicationRequest' },
            // Match the specific email within the "applicationRequest" array
            { $match: { 'applicationRequest.applicantsEmail': email } },
            // Project only the required fields
            {
                $project: {
                    _id: 0,
                    title: 1,
                    jobStatus: 1,
                    'applicationRequest.applicantsName': 1,
                    'applicationRequest.applicantsEmail': 1,
                    'applicationRequest.applicationStatus': 1,
                    'applicationRequest.startupsEmail': 1,
                    'applicationRequest.jobId': 1,
                    'applicationRequest.country': 1,
                    'applicationRequest.title': 1,
                    'applicationRequest.startupsProfilePhoto': 1,
                    'applicationRequest.startupsName': 1,
                    'applicationRequest._id': 1,
                    'applicationRequest.timestamp': 1,
                },
            },
            // Group the documents by jobId and collect all matching documents in an array
            {
                $group: {
                    _id: '$applicationRequest.jobId',
                    data: { $push: '$$ROOT' },
                },
            },
            // Project the final result with jobId and the first matching document
            {
                $project: {
                    _id: 0,
                    jobId: '$_id',
                    data: { $arrayElemAt: ['$data', 0] },
                },
            },
        ]);

        return result;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Example usage:
getApplicantData('cmidalimu@gmail.com')
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error(error);
    });
