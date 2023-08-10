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
// const filter = (req, file, cb) => {
//     const type = file.mimetype.split('/')[1];
//     if (
//         file.fieldname === 'startupIcon' ||
//         // file.fieldname === 'homePageImages' ||
//         file.fieldname === 'remoforceProfilePhoto'
//     ) {
//         if (type === 'jpg' || type === 'jpeg' || type === 'png') {
//             cb(null, true);
//         } else {
//             cb(new Error('Selected image is not a jpg/jpeg/png File!!'), false);
//         }
//     }
//     if (
//         file.fieldname === 'companyId' ||
//         file.fieldname === 'drivingLicense' ||
//         file.fieldname === 'passport' ||
//         file.fieldname === 'panCard' ||
//         file.fieldname === 'adharCard' ||
//         file.fieldname === 'gSTIN' ||
//         file.fieldname === 'addressProof' ||
//         file.fieldname === 'companyPAN' ||
//         file.fieldname === 'cINDocument' ||
//         file.fieldname === 'others' ||
//         file.fieldname === 'contractsPaper'
//     ) {
//         if (type === 'pdf' || type === 'jpg' || type === 'jpeg' || type === 'png') {
//             cb(null, true);
//         } else {
//             cb(new Error('file should be in .pdf|.jpg|.jpeg|.png format!!'), false);
//         }
//     }
//     if (file.fieldname === 'resume') {
//         if (type === 'pdf') {
//             cb(null, true);
//         } else {
//             cb(new Error('Resume Must be a pdf file'), false);
//         }
//     }
//     if (file.fieldname === 'requirements') {
//         if (type === 'pdf' || type === 'docx' || type === 'doc' ) {
//             cb(null, true);
//         } else {
//             cb(new Error('Not a pdf or doc File!!'), false);
//         }
//     }
// };
// const storage = multer.memoryStorage();
// const upload = multer({
//     storage,
//     limits: {
//         fileSize: 1000000,
//         // fieldSize:  1016 * 1016,
//     },
//     fileFilter: filter,
// });

// module.exports = upload;

// Common filter for image files (jpg, jpeg, png)
const imageFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[1];
    const allowedTypes = ['jpg', 'jpeg', 'png'];

    if (allowedTypes.includes(type)) {
        cb(null, true);
    } else {
        cb(new Error('File should be in .jpg|.jpeg|.png format!!'), false);
    }
};

// Filter for resume files (pdf)
const resumeFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[1];

    if (
        file.fieldname === 'startupIcon' ||
        // file.fieldname === 'homePageImages' ||
        file.fieldname === 'remoforceProfilePhoto'
    ) {
        if (type === 'jpg' || type === 'jpeg' || type === 'png') {
            cb(null, true);
        } else {
            cb(new Error('Selected image is not a jpg/jpeg/png File!!'), false);
        }
    }

    if (file.fieldname === 'resume') {
        if (type === 'pdf') {
            cb(null, true);
        } else {
            cb(new Error('Resume Must be a pdf file'), false);
        }
    } 
};

// Filter for requirements files (pdf, docx, doc)
const requirementsFilter = (req, file, cb) => {
    const type = file.mimetype.split('/')[1];
    const allowedTypes = ['pdf', 'docx', 'doc'];

    if (allowedTypes.includes(type)) {
        cb(null, true);
    } else {
        cb(new Error('File should be in .pdf|.docx|.doc format!!'), false);
    }
};
const genericFileFilter = (req, file, cb) => {
  

    const type = file.mimetype.split('/')[1];

    const allowedTypes = ['pdf', 'jpg', 'jpeg', 'png'];

    if (allowedTypes.includes(type)) {
        cb(null, true);
    } else {
        cb(new Error('File should be in .pdf|.jpg|.jpeg|.png format!!'), false);
    }
};

// Create multer instances with different filters
const genericUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000,
    },
    fileFilter: genericFileFilter,
});
const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000,
    },
    fileFilter: imageFilter,
});

const resumeUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000,
    },
    fileFilter: resumeFilter,
});

const requirementsUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1000000,
    },
    fileFilter: requirementsFilter,
});

module.exports = {
    imageUpload,
    resumeUpload,
    requirementsUpload,
    genericUpload,
};
