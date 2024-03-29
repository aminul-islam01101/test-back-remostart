/* eslint-disable no-await-in-loop */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable prefer-template */
const fs = require('fs');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;

const Startup = require('../models/startup.schema');
const backBlazeSingle = require('../configs/backBlazeSingle');
const User = require('../models/user.schema');

const removeFiles = (files) => {
    Object.keys(files).forEach((key) => {
        fs.unlinkSync(files[key][0].path, (err) => {
            if (err) console.log(err);
        });
    });
};

const updateProfileSettings = async (req, res) => {
    const obj = JSON.parse(req.body.obj);
    const { email, startupIcon } = obj;
    // const startupIcon = req.files?.startupIcon[0];
    // const  homePageImages  = req.files?.homePageImages;

    // console.log(homePageImages);
    // const uploadedFilesUrls = [];

    let profileUrl = '';
    if (req.files?.startupIcon && req.files?.startupIcon?.length) {
        profileUrl = await backBlazeSingle(req.files.startupIcon[0]);

        obj.startupIcon = profileUrl;
    }
    // if (homePageImages && homePageImages?.length) {
    //     for (const file of homePageImages) {
    //         const url = await backBlazeSingle(file);
    //         uploadedFilesUrls.push(url);
    //     }
    //     obj.homePageImages = uploadedFilesUrls;
    // }
    // removeFiles(req.files);

    try {
        if (email) {
            const updateUser = await User.updateOne(
                { email },
                { profilePhoto: profileUrl || startupIcon },
                { upsert: true }
            );
            const response = await Startup.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            fs.unlinkSync(req.file.path);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        fs.unlinkSync(req.file.path);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateGeneralSettingsPersonal = async (req, res) => {
    const obj = JSON.parse(req.body.obj);
    const { email } = obj;

    const { files } = req;

    if (req.files && req.files.length) {
        try {
            const uploadPromises = files.map(async (file) => {
                const url = await backBlazeSingle(file);
                return { [file.fieldname]: url };
            });

            const uploadedDocuments = await Promise.all(uploadPromises);
            const mergedPersonalIds = uploadedDocuments.reduce(
                (result, current) => ({ ...result, ...current }),
                {}
            );
            obj.personalIds = { ...obj.personalIds, ...mergedPersonalIds  };
        } catch (error) {
            // Handle error if file upload fails
            return res.status(500).send({ message: 'File upload error' });
        }
    }

    // res.send('ok')
    // const uploadedFilesUrls = {};
    // let updateDoc = req.body

    // if (req.files && req.files.length) {

    //     files.forEach(async(file) => {
    //         const url = await backBlazeSingle(file);
    //         obj.personalIds = [...obj.personalIds, { [file.fieldname]: url }];

    //     })

    // for (const file in files) {
    // const file = files[fileKey][0];
    // const url = await backBlazeSingle(file);
    // obj.personalIds = [...obj.personalIds, { [file.fieldName]: url }];
    // uploadedFilesUrls[fileKey] = url;
    // }

    // const document = Object.keys(uploadedFilesUrls).map((key) => ({
    //     [key]: uploadedFilesUrls[key],
    // }));

    //  updateDoc = { ...req.body, personalIds: document };
    // }

    // removeFiles(files);

    // obj.personalIds = personalIds;

    console.log(obj);

    // res.send('route ok');

    try {
        if (email) {
            const response = await Startup.updateOne({ email }, obj, { upsert: true });
            res.status(200).send(response);
        } else {
            // removeFiles(req.files);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // removeFiles(req.files);
        res.status(500).send({
            message: error.message,
        });
    }
};
const updateGeneralSettingsVerification = async (req, res) => {
    const obj = JSON.parse(req.body.obj);
    const { email } = obj;

    const { files } = req; // get uploaded files from request

    if (req.files && req.files.length) {
        try {
            const uploadPromises = files.map(async (file) => {
                const url = await backBlazeSingle(file);
                return { [file.fieldname]: url };
            });

            const uploadedDocuments = await Promise.all(uploadPromises);
            const mergedCompanyDocs = uploadedDocuments.reduce(
                (result, current) => ({ ...result, ...current }),
                {}
            );
            obj.companyDocs = { ...obj.companyDocs, ...mergedCompanyDocs };
        } catch (error) {
            // Handle error if file upload fails
            return res.status(500).send({ message: 'File upload error' });
        }
    }

    // console.log(uploadedFilesUrls);

    // res.send('route ok');

    try {
        if (email) {
            const response = await Startup.updateOne({ email }, obj, { upsert: true });

            res.status(200).send(response);
        } else {
            console.log('hello');

            // removeFiles(req.files);
            res.status(404).send({ message: 'something' });
        }
    } catch (error) {
        // removeFiles(req.files);
        res.status(500).send({
            message: error.message,
        });
    }
};
// verify pass
const verifyPass = async (req, res) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!bcrypt.compareSync(password, userExist.password)) {
        return res.send({
            success: false,
            message: 'Incorrect password',
        });
    }
    if (bcrypt.compareSync(password, userExist.password)) {
        return res.send({
            success: true,
            message: 'bingo! correct password',
        });
    }
};
// update pass
const updatePass = async (req, res) => {
    const { email, password } = req.body;

    try {
        // check existing user
        const userExist = await User.findOne({ email });
        if (bcrypt.compareSync(password, userExist.password)) {
            return res.send({
                status: 410,
                success: false,
                message: 'you cant use previous password',
            });
        }

        if (userExist) {
            // hash new password
            bcrypt.hash(password, saltRounds, async (err, hash) => {
                if (err) {
                    throw err;
                }

                // update user's password
                const filter = { email };
                const update = { password: hash };
                const result = await User.updateOne(filter, update);

                res.send(result);
            });
        } else {
            res.status(404).send(`User with email ${email} not found`);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
// get a start ups data
const startupData = async (req, res) => {
    const { email } = req.params;
    try {
        const userExist = await Startup.findOne({ email });
        res.send(userExist);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
// request for verification
const verificationRequest = async (req, res) => {
    const { verificationStatus, verificationRequest: request, email } = req.body;
    console.log(req.body);

    try {
        const filter = { email };
        const update = { verificationStatus, startupName: 'test', verificationRequest: request };
        const result = await Startup.updateOne(filter, update, { upsert: true });
        console.log(result);

        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
// get available slots

module.exports = {
    updateProfileSettings,
    updateGeneralSettingsPersonal,
    updateGeneralSettingsVerification,
    verifyPass,
    updatePass,
    startupData,
    verificationRequest,
};
