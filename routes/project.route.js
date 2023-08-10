const express = require('express');
const addProject = require('../controllers/project.controller');
const { requirementsUpload } = require('../middleware/fileUploads');



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

router.post(
    '/',
    requirementsUpload.fields([{ name: 'requirements', maxCount: 1 }]),
    multerErrorHandler,
    addProject
);

module.exports = router;
