require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const StartUp = require('../models/startup.schema');
const RemoForce = require('../models/remoForce.schema');
const { emailBody } = require('../views/emailBody');
const { sendMailWithNodeMailer } = require('../configs/nodemailer');
const { emailVerifyBody } = require('../views/emailVerifyBody');

const saltRounds = 10;

// const register = async (req, res) => {
//     const {
//         password,
//         firstName,
//         lastName,
//         personalPhone,
//         email,
//         role,
//         // designation,
//         // companyId,
//         // linkedIn,
//         // officePhone,
//         companyEmail,
//         talentRequestPaymentDetails,
//     } = req.body;

//     try {
//         // check existing user
//         const userExist = await User.findOne({ email });

//         if (userExist)
//             return res.send({
//                 success: false,
//                 message: `user already registered as a ${userExist.role}`,
//             });
//         // saving a new user
//         bcrypt.hash(password, saltRounds, async (err, hash) => {
//             if (role === 'startup') {
//                 const newStartup = new StartUp({
//                     fullName: `${firstName} ${lastName}`,
//                     email,
//                     personalPhone,
//                     // designation,
//                     // companyId,
//                     companyEmail,
//                     // linkedIn,
//                     // officePhone,
//                     talentRequestPaymentDetails,
//                 });

//                 await newStartup
//                     .save()
//                     .then((startup) => console.log(startup))
//                     .then(async () => {
//                         const newStartupUser = await StartUp.findOne({ email });
//                         const newUser = new User({
//                             fullName: `${firstName} ${lastName}`,
//                             email,
//                             ventureId: newStartupUser._id,
//                             password: hash,
//                             personalPhone,
//                             role,
//                         });
//                         await newUser.save().then((user) => {
//                             res.send({
//                                 success: true,
//                                 message: 'User is created Successfully',
//                                 user: {
//                                     id: user._id,

//                                     userName: user.fullName,
//                                 },
//                             });
//                         });
//                     })
//                     .catch((error) => {
//                         res.send({
//                             success: false,
//                             message: 'User is not created',
//                             error,
//                         });
//                     });
//             }
//             if (role === 'remoforce') {
//                 const newRemoForce = new RemoForce({
//                     fullName: `${firstName} ${lastName}`,
//                     email,
//                     personalPhone,
//                 });

//                 await newRemoForce
//                     .save()
//                     .then((remoforce) => console.log(remoforce))
//                     .then(async () => {
//                         const newRemoForceUser = await RemoForce.findOne({ email });
//                         const newUser = new User({
//                             fullName: `${firstName} ${lastName}`,
//                             email,
//                             ventureId: newRemoForceUser._id,
//                             password: hash,
//                             personalPhone,
//                             role,
//                         });
//                         await newUser.save().then((user) => {
//                             res.send({
//                                 success: true,
//                                 message: 'User is created Successfully',
//                                 user: {
//                                     id: user._id,
//                                     userName: user.fullName,
//                                 },
//                             });
//                         });
//                     })
//                     .catch((error) => {
//                         res.send({
//                             success: false,
//                             message: 'User is not created',
//                             error,
//                         });
//                     });
//             }
//         });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };

const register = async (req, res) => {
    const {
        password,
        firstName,
        lastName,
        personalPhone,
        startupName,
        startupPhoneNumber,
        email,
        role,
        companyEmail,
        talentRequestPaymentDetails,
    } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
        // await session.commitTransaction();
        // session.endSession();
        return res.status(409).send({
            success: false,
            message: `User already registered as a ${userExist.role}`,
        });
    }

    const session = await mongoose.startSession();

    let updatedData = null;
    try {
        session.startTransaction();
        const hash = await bcrypt.hash(password, saltRounds);
        const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

        const otp = Math.floor(1000 + Math.random() * 9000);

        if (role === 'startup') {
            const newStartup = new StartUp({
                startupName,
                email,
                officePhone: startupPhoneNumber,
                // companyEmail,
                talentRequestPaymentDetails,
            });

            const createdStartup = await newStartup.save({ session });
            const newStartupUser = new User({
                fullName: startupName,
                email,
                ventureId: createdStartup._id,
                password: hash,
                personalPhone: startupPhoneNumber,
                role,
                signInMethod: 'not-verified',
                confirmationToken: otp.toString(),
            });

            const createdStartupUser = await newStartupUser.save({ session });

            updatedData = createdStartupUser;
        } else if (role === 'remoforce') {
            const newRemoForce = new RemoForce({
                fullName: `${firstName} ${lastName}`,
                email,
                personalPhone,
            });

            const createdRemoForce = await newRemoForce.save({ session });

            const newRemoForceUser = new User({
                fullName: `${firstName} ${lastName}`,
                email,
                ventureId: createdRemoForce._id,
                password: hash,
                personalPhone,
                role,
                signInMethod: 'not-verified',
                confirmationToken: otp.toString(),
            });

            const createdRemoForceUser = await newRemoForceUser.save({ session });

            updatedData = createdRemoForceUser;
        }

        const url = `${process.env.CLIENT}/verify-email?email=${updatedData.email}`;
        const option = 'verify email';
        const mailData = {
            to: [email],
            subject: 'verify your Email',
            html: emailVerifyBody(url, option, otp),
        };

        // Sending email within the transaction
        const message = await sendMailWithNodeMailer(mailData);
        if (!message.messageId) {
            throw new Error('Email failure');
        }

        await session.commitTransaction();
        session.endSession();
    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        return res.status(500).send({
            success: false,
            message:
                error.message === 'Email failure'
                    ? 'User registration failed due to Email failure'
                    : 'User registration failed',
            error: error.message,
        });
    }
    if (updatedData?.email) {
        res.status(200).send({
            success: true,
            message: 'User registration successful',
            user: {
                id: updatedData._id,
                userName: updatedData.fullName,
                email: updatedData.email,
            },
            data: '/verify-email',
        });
    } else {
        res.status(500).send({
            success: false,
            message: 'User registration failed',
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email });

    if (!userExist) {
        return res.send({
            status: 400,
            success: false,
            message: 'User is not found',
        });
    }
    if (userExist.signInMethod === 'not-verified') {
        const otp = Math.floor(1000 + Math.random() * 9000);
        const url = `${process.env.CLIENT}/verify-email?email=${userExist.email}`;
        const option = 'verify email';
        const mailData = {
            to: [email],
            subject: 'verify your Email',
            html: emailVerifyBody(url, option, otp),
        };

        // Sending email within the transaction
        const message = await sendMailWithNodeMailer(mailData);
        if (!message.messageId) {
            throw new Error('Email failure');
        }
        const updatedData = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    confirmationToken: otp.toString(),
                },
            },
            { new: true }
        );
        if (updatedData) {
            return res.send({
                message: 'not-verified',
                data: '/verify-email',
                email: userExist.email,
            });
        }
    }

    if (!bcrypt.compareSync(password, userExist.password)) {
        return res.send({
            status: 401,
            success: false,
            message: 'Incorrect password',
        });
    }

    const payload = {
        id: userExist._id,
        email: userExist.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });

    return res.send({
        status: 200,
        success: true,
        message: 'User is logged in successfully',
        token: `Bearer ${token}`,
        role: userExist.role,
    });
};

const user = async (req, res) => {
    const { email } = req.user;

    const userExist = await User.findOne(
        { email },
        { fullName: 1, email: 1, role: 1, profilePhoto: 1 }
    );
    console.log('🚀 ~ file: auth.controller.js:173 ~ user ~ userExist:', userExist);

    if (!userExist) {
        res.status(200).send({
            success: false,
            user: null,
        });
        return;
    }

    res.cookie('userRole', userExist.role, {
        secure: true,
        sameSite: 'none',
        //  httpOnly: true
    });

    res.status(200).send({
        success: true,
        user: userExist,
    });
};
const forgotPass = async (req, res) => {
    try {
        const { email } = req.body;
        const userExist = await User.findOne({ email });
        if (!userExist) {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });

            return;
        }
        if (userExist.signInMethod === 'google') {
            res.status(409).send({
                success: false,
                message: 'registered with a Google account. Password cant be reset',
            });
            return;
        }
        if (userExist.signInMethod === 'linkedin') {
            res.status(409).send({
                success: false,
                message: 'registered with a Linkedin account. Password cant be reset',
            });
            return;
        }
        if (userExist.signInMethod === 'facebook') {
            res.status(409).send({
                success: false,
                message: 'registered with a Facebook account. Password cant be reset',
            });

            return;
        }
        const confirmationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });
        const tokenAdded = await User.updateOne({ email }, { confirmationToken });
        if (tokenAdded.modifiedCount === 0) {
            res.status(500).send({
                success: false,
                message: "Your request can't be processed at the moment",
            });

            return;
        }
        const url = `${process.env.CLIENT}/reset-pass?token=${confirmationToken}`;
        const option = 'Reset password';
        const mailData = {
            to: [email],
            subject: 'Reset Your Password',

            html: emailBody(url, option),
        };

        const message = await sendMailWithNodeMailer(mailData);
        if (message.messageId) {
            res.status(200).send({
                success: true,
                message: 'an email with reset link has been sent to your email address',
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const resetPass = async (req, res) => {
    try {
        const { password, confirmPassword, confirmationToken } = req.body;
        if (password !== confirmPassword) {
            res.status(400).send({
                success: false,
                message: 'Password and Confirm Password does not match',
            });
            return;
        }
        if (!confirmationToken) {
            res.status(400).send({
                success: false,
                message: 'You are not authorized',
            });
            return;
        }
        const decoded = jwt.verify(confirmationToken, process.env.JWT_SECRET);
        if (!decoded) {
            res.status(400).send({
                success: false,
                message: 'You are not authorized',
            });
            return;
        }
        const { email } = decoded;
        const userExist = await User.findOne({ email }).exec();

        if (!userExist) {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });

            return;
        }
        if (bcrypt.compareSync(password, userExist.password)) {
            return res.status(404).send({
                success: false,
                message: 'You cant use the same password as before',
            });
        }

        const hashPass = bcrypt.hashSync(password, 10);
        const update = await User.updateOne({ email }, { password: hashPass });
        if (update.modifiedCount === 1) {
            return res.status(200).send({
                success: true,
                message: 'you have successfully reset your password',
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const userExist = await User.findOne({ email }).exec();

        if (!userExist) {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });

            return;
        }
        if (!otp) {
            res.status(404).send({
                success: false,
                message: 'otp not found',
            });

            return;
        }

        if (userExist.confirmationToken === otp) {
            const updatedData = await User.findOneAndUpdate(
                { email },
                {
                    $set: {
                        confirmationToken: null,
                        signInMethod: 'verified',
                    },
                },
                { new: true }
            );

            if (updatedData) {
                return res.status(200).send({
                    success: true,
                    message: 'you have successfully verified your email ',
                });
            }
        }

        return res.status(200).send({
            success: false,
            message: 'verification failed ',
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const userExist = await User.findOne({ email }).exec();

        if (!userExist) {
            res.status(404).send({
                success: false,
                message: 'User not found',
            });

            return;
        }
        const otp = Math.floor(1000 + Math.random() * 9000);
        const url = `${process.env.CLIENT}/verify-email?email=${userExist.email}`;
        const option = 'verify email';
        const mailData = {
            to: [email],
            subject: 'verify your Email',
            html: emailVerifyBody(url, option, otp),
        };

        // Sending email within the transaction
        const message = await sendMailWithNodeMailer(mailData);
        if (!message.messageId) {
            throw new Error('Email failure');
        }

        const updatedData = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    confirmationToken: otp.toString(),
                },
            },
            { new: true }
        );
        if (updatedData) {
            return res.status(200).send({
                success: true,
            });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

const getRemoforceScore = async (req, res) => {
    const { email } = req.params;

    const remoforce = await RemoForce.findOne({ email });
    const { profileScore } = remoforce;
    let score = profileScore.totalScore;

    if (profileScore.totalScore < 96) {
        if (profileScore.profile < 25) {
            if (
                remoforce.personalDetails &&
                Object.keys(remoforce.personalDetails).length > 0 &&
                remoforce.resume &&
                remoforce.remoforceProfilePhoto
            ) {
                remoforce.profileScore.profile = 25;
                score += 25;
            }
        }
        if (profileScore.skill < 20) {
            if (
                remoforce.selectedSkills &&
                remoforce.selectedSkills.length > 0 &&
                remoforce.softSkills &&
                remoforce.softSkills.length > 0 &&
                remoforce.selectedLanguages &&
                remoforce.selectedLanguages.length > 0 &&
                remoforce.jobPreference &&
                Object.keys(remoforce.jobPreference).length > 0
            ) {
                remoforce.profileScore.skill = 20;
                score += 20;
            }
        }
        if (profileScore.education < 20) {
            if (remoforce.educationDetails && remoforce.educationDetails.length > 0) {
                remoforce.profileScore.education = 20;
                score += 20;
            }
        }
        if (profileScore.experience < 15) {
            if (remoforce.experienceDetails && remoforce.experienceDetails.length > 0) {
                remoforce.profileScore.experience = 15;
                score += 15;
            }
        }
        if (profileScore.projects < 15) {
            if (remoforce.projectDetails && remoforce.projectDetails.length > 0) {
                remoforce.profileScore.projects = 15;
                score += 15;
            }
        }
        if (profileScore.accounts < 5) {
            if (
                remoforce.personalDetails &&
                Object.keys(remoforce.personalDetails).length > 0 &&
                remoforce.personalDetails.alternativeEmail
            ) {
                remoforce.profileScore.accounts = 5;
                score += 5;
            }
        }

        remoforce.profileScore.totalScore = score;
        await remoforce.save();
    }

    try {
        res.status(200).send({
            success: true,
            data: remoforce.profileScore,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
const getStartupScore = async (req, res) => {
    const { email } = req.params;

    const startup = await StartUp.findOne({ email });
  if (startup.registrationData) {
    console.log('🌼 🔥🔥 file: auth.controller.js:661 🔥🔥 getStartupScore 🔥🔥 startup🌼', Object.keys({...startup.registrationData.toObject()}).length);
  }

    const { profileScore } = startup;

    let score = profileScore.totalScore;

    if (profileScore.totalScore < 96) {
        if (profileScore.profile < 60) {
            if (
                startup.startupDescription &&
                startup.startupIcon &&
                startup.startupSlogan &&
                startup.worksIn &&
                startup.domains &&
                startup.domains.length > 0 
                // startup.socialLinks &&
                // startup.socialLinks.length > 0
            ) {
                startup.profileScore.profile = 60;
                score += 60;
            }
        }
        if (profileScore.personnel < 10) {
            if (
                startup.fullName &&
                startup.designation &&
                startup.personalPhone &&
                startup.linkedIn &&
                startup.personalIds &&
                Object.keys(startup.personalIds).length > 0 &&
                startup.secondaryEmail
            ) {
                startup.profileScore.personnel = 10;
                score += 10;
            }
        }
        if (profileScore.registration < 10) {
            if (startup.registrationData && Object.keys({...startup.registrationData.toObject()}).length > 0) {
                startup.profileScore.registration = 10;
                score += 10;
            }
        }
        if (profileScore.founder < 20) {
            if (startup.foundersDetail && Object.keys({...startup.foundersDetail.toObject()}).length  > 0) {
                startup.profileScore.founder = 20;
                score += 20;
            }
        }
    }
    startup.profileScore.totalScore = score;
    await startup.save();
    try {
        res.status(200).send({
            success: true,
            data: startup.profileScore,
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

module.exports = {
    register,
    login,
    user,
    forgotPass,
    resetPass,
    verifyEmail,
    resendOtp,
    getRemoforceScore,
    getStartupScore,
};
