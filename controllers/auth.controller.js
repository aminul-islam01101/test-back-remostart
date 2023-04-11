require('dotenv').config();
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require('../models/user.schema');
const StartUp = require('../models/startup.schema');
const RemoForce = require('../models/remoForce.schema');

const saltRounds = 10;

const register = async (req, res) => {
    const {
        password,
        firstName,
        lastName,
        personalPhone,
        email,
        role,
        designation,
        companyId,
        linkedIn,
        officePhone,
        companyEmail,
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
                    designation,
                    companyId,
                    companyEmail,
                    linkedIn,
                    officePhone,
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
        expiresIn: '2d',
    });

    return res.send({
        status: 200,
        success: true,
        message: 'User is logged in successfully',
        token: `Bearer ${token}`,
        role: userExist.role,
    });
};

const user = (req, res) =>
    res.status(200).send({
        success: true,
        user: req.user,
    });

module.exports = {
    register,
    login,
    user,
};
