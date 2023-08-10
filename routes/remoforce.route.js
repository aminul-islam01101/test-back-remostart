const express = require('express');
const {
    updateRemoProfileSettings,
    updateRemoSkillsSettings,
    updateRemoEducationSettings,
    updateRemoExperienceSettings,
    getRemoforceProfile,
    updateRemoAccountSettings,
    updateRemoProjectsSettings,
    getMatchedTalents,
    getMyJobRequests
} = require('../controllers/remoforceSettings.controller');
const { resumeUpload } = require('../middleware/fileUploads');
// const {
//     updateGeneralSettingsPersonal,
//     updateGeneralSettingsVerification,
//     verifyPass,
//     updatePass,
//     startupData,
//     verificationRequest,
// } = require('../controllers/startupSettings.controller');


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

const router = express.Router();

// create user using POST method
// router.post('/', createUser);
// router.put('/settings-profile', updateProfileSettings);
// router.put('/settings-profile',  updateProfileSettings);
// router.put(
//     '/settings-profile',
//     upload.single('startupIcon'),
//     upload.array('documents', 5),
//     multerErrorHandler,
//     updateProfileSettings
// );
router.put(
    '/remoforce-settings-profile',
   
    resumeUpload.fields([
        { name: 'remoforceProfilePhoto', maxCount: 1 },
        { name: 'resume', maxCount: 1 },
    ]),
    multerErrorHandler,
    updateRemoProfileSettings
);
router.put(
    '/remoforce-settings-skills',

    updateRemoSkillsSettings
);
router.put(
    '/remoforce-settings-education',

    updateRemoEducationSettings
);
router.put(
    '/remoforce-settings-experience',

    updateRemoExperienceSettings
);
router.put(
    '/remoforce-settings-projects',

    updateRemoProjectsSettings
);
router.put(
    '/remoforce-settings-account',

    updateRemoAccountSettings
);
router.get(
    '/remoforce-profile/:email',

    getRemoforceProfile
);
router.get(
    '/all-my-requests/:email',

    getMyJobRequests
);

// talent route



// router.put(
//     '/settings-general-personal',
//     upload.fields([
//         { name: 'panCard', maxCount: 1, optional: true },
//         { name: 'adharCard', maxCount: 1, optional: true },
//         { name: 'drivingLicense', maxCount: 1, optional: true },
//         { name: 'passport', maxCount: 1, optional: true },
//     ]),
//     multerErrorHandler,
//     updateGeneralSettingsPersonal
// );
// router.put(
//     '/settings-general-verification',
//     upload.fields([
//         { name: 'gSTIN', maxCount: 1, optional: true },
//         { name: 'addressProof', maxCount: 1, optional: true },
//         { name: 'cINDocument', maxCount: 1, optional: true },
//         { name: 'companyPAN', maxCount: 1, optional: true },
//         { name: 'others', maxCount: 1, optional: true },
//     ]),
//     multerErrorHandler,
//     updateGeneralSettingsVerification
// );

// // verify pass
// router.post(
//     '/verifyPass',

//     verifyPass
// );
// router.post(
//     '/updatePass',

//     updatePass
// );
// // get a startup data
// router.get(
//     '/startup-preview/:email',

//     startupData
// );
// router.put(
//     '/verification-request',

//     verificationRequest
// );

// get all user using GET method
// router.get('/', getAllUser);

// get single user using GET method
// router.get('/:id', getUserById);

module.exports = router;
