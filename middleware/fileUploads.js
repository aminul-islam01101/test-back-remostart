require('dotenv').config();
const multer = require('multer');
const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {

//         if (file.fieldname === 'startupIcon') {
//             cb(null, './uploads/startupIcons');
//         } else if (file.fieldname === 'companyId') {
//             cb(null, './uploads/companyIds');
//         } else if (file.fieldname === 'homePageImages') {
//             cb(null, './uploads/documents');
//         } else if (file.fieldname === 'panCard') {
//             cb(null, './uploads/personalIds/panCards');
//         } else if (file.fieldname === 'adharCard') {
//             cb(null, './uploads/personalIds/adharCards');
//         }
//          else if (file.fieldname === 'passport') {
//             cb(null, './uploads/personalIds/passports');
//         } else if (file.fieldname === 'drivingLicense') {
//             cb(null, './uploads/personalIds/drivingLicenses');
//         }
//          else if (file.fieldname === 'gSTIN') {
//             cb(null, './uploads/companyDocs/gstin');
//         }
//          else if (file.fieldname === 'addressProof') {
//             cb(null, './uploads/companyDocs/addressProof');
//         }
//          else if (file.fieldname === 'cINDocument') {
//             cb(null, './uploads/companyDocs/cINDocument');
//         }
//         else if (file.fieldname === 'companyPAN') {
//             cb(null, './uploads/companyDocs/companyPAN');
//         }
//         else if (file.fieldname === 'others') {
//             cb(null, './uploads/companyDocs/others');
//         }
//          else if (file.fieldname === 'contractsPaper') {
//             cb(null, './uploads/contractsPaper');
//         }
//     },

//     filename: (req, file, cb) => {
//         const fileExt = path.extname(file.originalname);
//         const fileName = `${file.originalname
//             .replace(fileExt, '')
//             .toLowerCase()
//             .split(' ')
//             .join('-')}-${Date.now()}`;

//         const fullFileName = `${file.fieldname}-${fileName}${fileExt}`;

//         cb(null, fullFileName);

//     },

// });
const filter = (req, file, cb) => {
    const type = file.mimetype.split('/')[1];
    if (
        file.fieldname === 'startupIcon' ||
        file.fieldname === 'homePageImages' ||
        file.fieldname === 'remoforceProfilePhoto'
    ) {
        if (type === 'jpg' || type === 'jpeg' || type === 'png') {
            cb(null, true);
        } else {
            cb(new Error('Not a jpg/jpeg File!!'), false);
        }
    }
    if (
        file.fieldname === 'companyId' ||
        file.fieldname === 'drivingLicense' ||
        file.fieldname === 'passport' ||
        file.fieldname === 'panCard' ||
        file.fieldname === 'adharCard' ||
        file.fieldname === 'gSTIN' ||
        file.fieldname === 'addressProof' ||
        file.fieldname === 'companyPAN' ||
        file.fieldname === 'cINDocument' ||
        file.fieldname === 'others' ||
        file.fieldname === 'contractsPaper'
    ) {
        if (type === 'pdf' || type === 'jpg' || type === 'jpeg' || type === 'png') {
            cb(null, true);
        } else {
            cb(new Error('file should be in .pdf|.jpg|.jpeg|.png format!!'), false);
        }
    }
    if (file.fieldname === 'resume') {
        if (type === 'pdf') {
            cb(null, true);
        } else {
            cb(new Error('Not a pdf File!!'), false);
        }
    }
};
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: {
        fileSize: 1000000,
        // fieldSize:  1016 * 1016,
    },
    fileFilter: filter,
});

module.exports = upload;
