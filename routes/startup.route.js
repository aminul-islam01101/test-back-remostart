const express = require('express');
const multer = require('multer');
const { updateProfileSettings } = require('../controllers/startupSettings.controller');
const {
    updateGeneralSettingsPersonal,
    updateGeneralSettingsVerification,
    verifyPass,
    updatePass,
    startupData,
    verificationRequest,
 
} = require('../controllers/startupSettings.controller');
const { genericUpload, imageUpload } = require('../middleware/fileUploads');


// const multerErrorHandler = (err, req, res, next) => {
//     if (err) {
//         res.status(400).send({
//             success: false,
//             message: err.message,
//         });
//     } else {
//         next();
//     }
// };
const multerErrorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).send({ message: 'Image too large, you can upload files up to 1MB' });
      }
      // Handle other Multer errors if needed
    } else if (err) {
      return res.status(400).send({ message: err.message });
    }
    next();
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
    '/settings-profile',
    imageUpload.fields([
        { name: 'startupIcon', maxCount: 1 },
        // { name: 'homePageImages', maxCount: 5 },
    ]),
    multerErrorHandler,
    updateProfileSettings
);
router.put(
    '/settings-general-personal',
    genericUpload.any(),
    multerErrorHandler,
    updateGeneralSettingsPersonal
);
router.put(
    '/settings-general-verification',
    genericUpload.any(),
    multerErrorHandler,
    updateGeneralSettingsVerification
);
// router.put(
//     '/settings-general-verification',
//     genericUpload.fields([
//         { name: 'gSTIN', maxCount: 1, optional: true },
//         { name: 'addressProof', maxCount: 1, optional: true },
//         { name: 'cINDocument', maxCount: 1, optional: true },
//         { name: 'companyPAN', maxCount: 1, optional: true },
//         { name: 'others', maxCount: 1, optional: true },
//     ]),
//     multerErrorHandler,
//     updateGeneralSettingsVerification
// );

// verify pass
router.post(
    '/verifyPass',

    verifyPass
);
router.post(
    '/updatePass',

    updatePass
);
// get a startup data
router.get(
    '/startup-preview/:email',

    startupData
);
router.put(
    '/verification-request',

    verificationRequest
);


// get all user using GET method
// router.get('/', getAllUser);

// get single user using GET method
// router.get('/:id', getUserById);

module.exports = router;
