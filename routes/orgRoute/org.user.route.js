const express = require('express');

const AuthRoutes = express.Router();
const { roleVerifier } = require('../../middleware/roleVerifier');
const { orgUserRole } = require('../../constants/org.user.constants');
const {
    createUser,
    loginUser,
    loginSuperAdmin,
    changePassword,
    loggedInOrgUser,
} = require('../../controllers/orgControllers/org.user.controllers');
const { orgUserVerifier } = require('../../middleware/orgUserVerifier');

const { ADMIN, CONTENT, DEVELOPMENT, MARKETING, SUPER_ADMIN } = orgUserRole;

AuthRoutes.post('/signup', roleVerifier(SUPER_ADMIN), createUser);
AuthRoutes.post('/login', loginUser);
AuthRoutes.post('/s-admin/login', loginSuperAdmin);
AuthRoutes.get('/user', orgUserVerifier, loggedInOrgUser);

// AuthRoutes.post('/refresh-token', AuthController.refreshToken);

AuthRoutes.post(
    '/change-password',
    roleVerifier(ADMIN, CONTENT, DEVELOPMENT, MARKETING, SUPER_ADMIN),
    changePassword
);

module.exports = AuthRoutes;
