const mongoose = require('mongoose');
const {
    generateAdminId,
    generateDevelopmentId,
    generateContentCreatorId,

    generateMarketerId,
} = require('../../utils/orgUserUtils/org.user.id');
const orgUser = require('../../models/orgModels/org.usr.schema');
const { createToken } = require('../../utils/jwtHelpers');
const { sendMailWithNodeMailer } = require('../../configs/nodemailer');

module.exports.loginUser = async (req, res) => {
    const { ...loginData } = req.body;
    const { email, password } = loginData;
    try {
        const isUserExist = await orgUser.isUserExist(email);

        if (!isUserExist) {
            return res.status(404).json({
                status: 'success',
                message: 'User does not exist',
            });
        }
        if (
            isUserExist.password &&
            !(await orgUser.isPasswordMatched(password, isUserExist.password))
        ) {
            return res.status(404).json({
                status: 'success',
                message: 'Password is incorrect',
            });
        }
        const { id: userId, role, email: userEmail, needsPasswordChange } = isUserExist;
        const accessToken = createToken(
            { id: userId, role, email: userEmail },
            process.env.JWT_SECRET,
            '1d'
        );
        const refreshToken = createToken(
            { id: userId, role, email: userEmail },
            process.env.JWT_SECRET,
            '5d'
        );
        const cookieOptions = {
            secure: false,
            httpOnly: true,
        };

        res.cookie('refreshToken', `Bearer ${refreshToken}`, cookieOptions);

        res.status(201).json({
            status: 'success',
            message: 'User created successfully',
            data: { accessToken: `Bearer ${accessToken}`, needsPasswordChange },
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports.changePassword = async (req, res) => {
    const { user } = req;
    const { ...passwordData } = req.body;
    const { oldPassword, newPassword } = passwordData;

    try {
        const isUserExist = await orgUser.isUserExist(user?.email);
        if (!isUserExist) {
            throw new Error('User does not exist');
        }

        // checking old password
        if (
            isUserExist.password &&
            !(await orgUser.isPasswordMatched(oldPassword, isUserExist.password))
        ) {
            throw new Error('Old Password is incorrect');
        }
        isUserExist.password = newPassword;
        isUserExist.needsPasswordChange = false;

        // updating using save()
        isUserExist.save();

        res.status(200).json({
            success: true,
            message: 'Password changed successfully !',
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports.createUser = async (req, res) => {
    const user = req.body;
    let newUserAllData = null;
    const session = await mongoose.startSession();
    try {
        session.startTransaction();
        const isUserExist = await orgUser.isUserExist(user.email);
        if (isUserExist) {
            return res.status(409).json({
                status: 'failed',
                message: 'User already exist with this email',
            });
        }

        if (user.role === 'admin') {
            user.password = process.env.ADMIN_PASS;
            const id = await generateAdminId();
            user.id = id;
        }
        if (user.role === 'developer') {
            user.password = process.env.DEVELOPER_PASS;
            const id = await generateDevelopmentId();
            user.id = id;
        }
        if (user.role === 'content_creator') {
            user.password = process.env.CONTENT_CREATOR_PASS;
            const id = await generateContentCreatorId();
            user.id = id;
        }
        if (user.role === 'marketer') {
            user.password = process.env.MARKETER_PASS;
            const id = await generateMarketerId();
            user.id = id;
        }
        const newUser = await orgUser.create([user], { session });
        if (!newUser.length) {
            throw new Error('Failed to create Team member');
        }
        [newUserAllData] = newUser;
        const mailData = {
            to: [user.email],
            subject: 'welcome to remostarts organizer panel',
            html: `you are new ${user.role}`,
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
        return res.status(500).json({
            status: 'failed',
            message: 'user creation failed',
            data: null,
        });
    }
    if (newUserAllData?.email) {
        res.status(201).json({
            status: 'success',
            message: 'team user created successfully!',
            data: newUserAllData,
        });
    }
};
