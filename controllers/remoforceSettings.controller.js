/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-template */
const fs = require('fs');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const Remoforce = require('../models/remoForce.schema');
const backBlazeSingle = require('../configs/backBlazeSingle');
const User = require('../models/user.schema');

const removeFiles = (files) => {
    Object.keys(files).forEach((key) => {
        fs.unlinkSync(files[key][0].path, (err) => {
            if (err) console.log(err);
        });
    });
};

const updateRemoProfileSettings = async (req, res) => {
    const obj = JSON.parse(req.body.obj);
    const { email } = obj;

    // console.log(homePageImages);
    // const uploadedFilesUrls = [];
    let profileUrl = '';

    if (req.files.remoforceProfilePhoto.length) {
        profileUrl = await backBlazeSingle(req.files.remoforceProfilePhoto[0]);

        obj.remoforceProfilePhoto = profileUrl;
    }
    if (req.files.resume.length) {
        const url = await backBlazeSingle(req.files.resume[0]);
        console.log(url);

        obj.resume = url;
    }

    // console.log(obj);

    // res.send('route ok')
    // User.updateOne({ email }, user, { upsert: true });

    try {
        if (email) {
            const updateUser = await User.updateOne(
                { email },
                { profilePhoto: profileUrl },
                { upsert: true }
            );
            const response = await Remoforce.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            // fs.unlinkSync(req.file.path);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // fs.unlinkSync(req.file.path);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateRemoSkillsSettings = async (req, res) => {
    // const obj = JSON.parse(req.body.obj);
    const { email } = req.body;

    const obj = req.body;
    console.log(obj);

    //  res.send('route ok')

    try {
        if (email) {
            const response = await Remoforce.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            // fs.unlinkSync(req.file.path);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // fs.unlinkSync(req.file.path);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateRemoEducationSettings = async (req, res) => {
    // const obj = JSON.parse(req.body.obj);
    const { email } = req.body;

    const obj = req.body;

    //  res.send('route ok')

    try {
        if (email) {
            const response = await Remoforce.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            // fs.unlinkSync(req.file.path);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // fs.unlinkSync(req.file.path);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateRemoExperienceSettings = async (req, res) => {
    // const obj = JSON.parse(req.body.obj);
    const { email } = req.body;

    const obj = req.body;

    //  res.send('route ok')
    console.log(email, obj);

    try {
        if (email) {
            const response = await Remoforce.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            // fs.unlinkSync(req.file.path);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // fs.unlinkSync(req.file.path);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateRemoProjectsSettings = async (req, res) => {
    // const obj = JSON.parse(req.body.obj);
    const { email } = req.body;

    const obj = req.body;

    //  res.send('route ok')
    console.log(email, obj);

    try {
        if (email) {
            const response = await Remoforce.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            // fs.unlinkSync(req.file.path);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // fs.unlinkSync(req.file.path);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateRemoAccountSettings = async (req, res) => {
    const { email, alternativeEmail } = req.body;

    try {
        const updatedUser = await Remoforce.updateOne(
            { email },
            { $set: { 'personalDetails.alternativeEmail': alternativeEmail } },
            { upsert: true }
        );

        console.log(updatedUser);
        res.send(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).send('Internal server error');
    }
};

const getRemoforceProfile = async (req, res) => {
    const { email } = req.params;
    try {
        const userExist = await Remoforce.findOne({ email });
        res.send(userExist);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
// const updateGeneralSettingsPersonal = async (req, res) => {
//     const { email } = req.body;

//     const { files } = req; // get uploaded files from request

//     const uploadedFilesUrls = {};

//     for (const fileKey in files) {
//         const file = files[fileKey][0];
//         const url = await backBlazeSingle(file);
//         uploadedFilesUrls[fileKey] = url;
//     }
//     // removeFiles(files);

//     // obj.personalIds = personalIds;
//     const document = Object.keys(uploadedFilesUrls).map((key) => ({
//         [key]: uploadedFilesUrls[key],
//     }));

//     const updateDoc = { ...req.body, personalIds: document };

//     console.log(updateDoc);
//     // console.log(uploadedFilesUrls);

//     // res.send('route ok');

//     try {
//         if (email) {
//             const response = await Startup.updateOne({ email }, updateDoc, { upsert: true });
//             res.status(200).send(response);
//         } else {
//             // removeFiles(req.files);
//             res.status(404).send({ message: 'something' });
//         }
//     } catch (error) {
//         // removeFiles(req.files);
//         res.status(500).send({
//             message: error.message,
//         });
//     }
// };
// const updateGeneralSettingsVerification = async (req, res) => {
//     const { files } = req; // get uploaded files from request

//     const uploadedFilesUrls = {};
//     const obj = JSON.parse(req.body.data);

//     const { email } = obj;

//     for (const fileKey in files) {
//         const file = files[fileKey][0];
//         const url = await backBlazeSingle(file);
//         uploadedFilesUrls[fileKey] = url;
//     }
//     // removeFiles(files);

//     // obj.personalIds = personalIds;
//     const document = Object.keys(uploadedFilesUrls).map((key) => ({
//         [key]: uploadedFilesUrls[key],
//     }));

//     const updateDoc = { ...obj, companyDocs: document };

//     // console.log(uploadedFilesUrls);

//     // res.send('route ok');

//     try {
//         if (email) {
//             const response = await Startup.updateOne({ email }, updateDoc, { upsert: true });
//             console.log(updateDoc);
//             res.status(200).send(response);
//         } else {
//             console.log('hello');

//             // removeFiles(req.files);
//             res.status(404).send({ message: 'something' });
//         }
//     } catch (error) {
//         // removeFiles(req.files);
//         res.status(500).send({
//             message: error.message,
//         });
//     }
// };
// // verify pass
// const verifyPass = async (req, res) => {
//     const { email, password } = req.body;
//     const userExist = await User.findOne({ email });

//     if (!bcrypt.compareSync(password, userExist.password)) {
//         return res.send({
//             success: false,
//             message: 'Incorrect password',
//         });
//     }
//     if (bcrypt.compareSync(password, userExist.password)) {
//         return res.send({
//             success: true,
//             message: 'bingo! correct password',
//         });
//     }
// };
// // update pass
// const updatePass = async (req, res) => {
//     const { email, password } = req.body;

//     try {
//         // check existing user
//         const userExist = await User.findOne({ email });
//         if (bcrypt.compareSync(password, userExist.password)) {
//             return res.send({
//                 status: 410,
//                 success: false,
//                 message: 'you cant use previous password',
//             });
//         }

//         if (userExist) {
//             // hash new password
//             bcrypt.hash(password, saltRounds, async (err, hash) => {
//                 if (err) {
//                     throw err;
//                 }

//                 // update user's password
//                 const filter = { email };
//                 const update = { password: hash };
//                 const result = await User.updateOne(filter, update);

//                 res.send(result);
//             });
//         } else {
//             res.status(404).send(`User with email ${email} not found`);
//         }
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
// get a start ups data
// const startupData = async (req, res) => {
//     const { email } = req.params;
//     try {
//         const userExist = await Startup.findOne({ email });
//         res.send(userExist);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
// request for verification
// const verificationRequest = async (req, res) => {
//     const { verificationStatus, verificationRequest: request, email } = req.body;
//     console.log(req.body);

//     try {
//         const filter = { email };
//         const update = { verificationStatus, startupName: 'test', verificationRequest: request };
//         const result = await Startup.updateOne(filter, update, { upsert: true });
//         console.log(result);

//         res.send(result);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
// get a start ups data

// talents section

module.exports = {
    updateRemoProfileSettings,
    updateRemoSkillsSettings,
    updateRemoEducationSettings,
    updateRemoExperienceSettings,
    updateRemoProjectsSettings,
    getRemoforceProfile,
    updateRemoAccountSettings,
   
};
