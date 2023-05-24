const express = require('express');
const {
    getCategories,
    createJob,
    editContractsJob,
    getContractsJobs,
    contractsJob,
    getUsersJobs,
    deleteUsersJob,
    getAllJobs,
    insertApplication,
    acceptApplication,
    rejectApplication,
    getCategoryJobs,
    getUsersActiveJobs,
    getUsersShadowingJobs,
    closeUsersJob,
    applicationRequests,

    getStatus,
    createInterviewSchedule
} = require('../controllers/job.controller');
// const {
//     getCategories,
//     publicJob,
//     privateJob,
//     internship,
//     contracts,
// } = require('../controllers/job.controller');
const upload = require('../middleware/fileUploads');

const router = express.Router();
const multerErrorHandler = (err, req, res, next) => {
    if (err) {
        res.status(400).send({
            success: false,
            message: err.message,
        });
    } else {
        next();
    }
};

// Post job using POST method
router.post('/public-job', createJob);
router.post('/private-job', createJob);
router.post('/internship', createJob);
router.post('/gigs', createJob);
router.post('/shadowing', createJob);
router.post(
    '/contracts',
    upload.fields([{ name: 'contractsPaper', maxCount: 1 }]),
    multerErrorHandler,
    contractsJob
);
router.put(
    '/contracts/:id',
    upload.fields([{ name: 'contractsPaper', maxCount: 1 }]),
    multerErrorHandler,
    editContractsJob
);

// GET: get users job
router.get('/categories', getCategories);
router.get('/user-jobs/:email', getUsersJobs);
router.get('/user-jobs/active/:email', getUsersActiveJobs);
router.get('/user-jobs/closed/:email', getUsersActiveJobs);
router.get('/user-jobs/shadowing/:email', getUsersShadowingJobs);
// router.get('/contracts/:id', getContractsJobs);
router.get('/apply-status', getStatus);
// GET: Jobs
router.get('/all-jobs', getAllJobs);
router.get('/remoforce/shadowing', getCategoryJobs);
router.get('/remoforce/public-job', getCategoryJobs);
router.get('/remoforce/private-job', getCategoryJobs);
router.get('/remoforce/internship', getCategoryJobs);
router.get('/remoforce/gigs', getCategoryJobs);
router.get('/remoforce/contracts', getCategoryJobs);

// DELETE: a job from all job
router.delete('/user-jobs/:id', deleteUsersJob);
// DELETE: a job from all job
router.put('/user-jobs/close/:id', closeUsersJob);

// PUT: insert application request
router.put('/user-jobs/:id', insertApplication);
router.get('/user-jobs/allApplicationRequests/:id', applicationRequests);

// PUT: update application status to accept
router.put('/accept/:id', acceptApplication);


// create-interview-schedule from startup
router.put('/create-interview-schedule', createInterviewSchedule);
// PUT: update application status to rejected
router.put('/reject', rejectApplication);

module.exports = router;
