require('dotenv').config();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const StartUp = require('../models/startup.schema');
const RemoForce = require('../models/remoForce.schema');
const { emailBody } = require('../views/emailBody');
const { sendMailWithNodeMailer } = require('../configs/nodemailer');

const saltRounds = 10;

const register = async (req, res) => {
    const {
        password,
        firstName,
        lastName,
        personalPhone,
        email,
        role,
        // designation,
        // companyId,
        // linkedIn,
        // officePhone,
        companyEmail,
        talentRequestPaymentDetails,
    } = req.body;

    try {
        // check existing user
        const userExist = await User.findOne({ email });

        if (userExist)
            return res.send({
                success: false,
                message: `user already registered as a ${userExist.role}`,
            });
        // saving a new user
        bcrypt.hash(password, saltRounds, async (err, hash) => {
            if (role === 'startup') {
                const newStartup = new StartUp({
                    fullName: `${firstName} ${lastName}`,
                    email,
                    personalPhone,
                    // designation,
                    // companyId,
                    companyEmail,
                    // linkedIn,
                    // officePhone,
                    talentRequestPaymentDetails,
                });

                await newStartup
                    .save()
                    .then((startup) => console.log(startup))
                    .then(async () => {
                        const newStartupUser = await StartUp.findOne({ email });
                        const newUser = new User({
                            fullName: `${firstName} ${lastName}`,
                            email,
                            ventureId: newStartupUser._id,
                            password: hash,
                            personalPhone,
                            role,
                        });
                        await newUser.save().then((user) => {
                            res.send({
                                success: true,
                                message: 'User is created Successfully',
                                user: {
                                    id: user._id,

                                    userName: user.fullName,
                                },
                            });
                        });
                    })
                    .catch((error) => {
                        res.send({
                            success: false,
                            message: 'User is not created',
                            error,
                        });
                    });
            }
            if (role === 'remoforce') {
                const newRemoForce = new RemoForce({
                    fullName: `${firstName} ${lastName}`,
                    email,
                    personalPhone,
                });
                console.log('hello');
                await newRemoForce
                    .save()
                    .then((remoforce) => console.log(remoforce))
                    .then(async () => {
                        const newRemoForceUser = await RemoForce.findOne({ email });
                        const newUser = new User({
                            fullName: `${firstName} ${lastName}`,
                            email,
                            ventureId: newRemoForceUser._id,
                            password: hash,
                            personalPhone,
                            role,
                        });
                        await newUser.save().then((user) => {
                            res.send({
                                success: true,
                                message: 'User is created Successfully',
                                user: {
                                    id: user._id,
                                    userName: user.fullName,
                                },
                            });
                        });
                    })
                    .catch((error) => {
                        res.send({
                            success: false,
                            message: 'User is not created',
                            error,
                        });
                    });
            }
        });
    } catch (error) {
        res.status(500).send(error.message);
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
        const mailData = {
            to: [email],
            subject: 'Reset Your Password',

            html: emailBody(url),
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

module.exports = {
    register,
    login,
    user,
    forgotPass,
    resetPass,
};
