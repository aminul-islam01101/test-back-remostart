const express = require('express');
const {
    getCategories,
    createJob,
  getUsersJobs, deleteUsersJob, getAllJobs, insertApplication,acceptApplication, rejectApplication, getStatus
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

// create user using POST method
// router.post('/', createUser);
// router.put('/:email', createUser);

// Post job using POST method
router.post('/public-job', createJob);

router.post('/private-job', createJob);
router.post('/internship', createJob);


// GET: get users job
router.get('/categories', getCategories);
router.get('/user-jobs/:email', getUsersJobs);
router.get('/all-jobs', getAllJobs);
router.get('/apply-status', getStatus);




 // DELETE: a job from all job
 router.delete('/user-jobs/:id', deleteUsersJob);

 // PUT: insert application request
 router.put('/user-jobs/:id', insertApplication);

 // PUT: update application status to accept
 router.put('/accept/:id', acceptApplication);
 // PUT: update application status to rejected
 router.put('/reject/:id', rejectApplication);


// router.post('/public-job', publicJob);
// router.post('/private-job', privateJob);
// router.post('/internship', internship);
// router.post('/contracts', contracts);
// router.put('/contracts', upload.single('contractsPaper'), multerErrorHandler, contracts);

// get single user using GET method
// router.get('/:id', getUserById);

module.exports = router;
