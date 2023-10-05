/* eslint-disable new-cap */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const orgUserSchema = mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: [true, 'Please provide User First name'],
        },
        lastName: {
            type: String,
            required: [true, 'Please provide User last name'],
        },
        email: {
            type: String,
            required: [true, 'Please provide your email'],
        },
        discordId: {
            type: String,
        },
        role: {
            type: String,
            enum: ['admin', 'super_admin', 'marketer', 'content_creator', 'developer'],
            required: true,
        },
        password: {
            type: String,
            required: true,
            select: 0,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

orgUserSchema.statics.isUserExist = async function isUserExist(email) {
    return this.findOne(
        { email },
        { id: 1, password: 1, role: 1, email: 1, needsPasswordChange: 1 }
    );
};
orgUserSchema.statics.isPasswordMatched = async function isPasswordMatched(
    givenPassword,
    savedPassword
) {
    return bcrypt.compare(givenPassword, savedPassword);
};
orgUserSchema.pre('save', async function HashPass(next) {
    // hashing user password
    const user = this;
    user.password = await bcrypt.hash(user.password, Number(10));

    if (!user.needsPasswordChange) {
        user.passwordChangedAt = new Date();
    }

    next();
});

const orgUser = new mongoose.model('orgUser', orgUserSchema);

module.exports = orgUser;
