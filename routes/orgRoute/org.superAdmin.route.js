const express = require('express');
const {getAllStartups, getAllMembers}= require('../../controllers/orgControllers/org.superAdmin.controllers');
const { roleVerifier } = require('../../middleware/roleVerifier');
const { orgUserRole } = require('../../constants/org.user.constants');

const routes = express.Router();
const { ADMIN, CONTENT, DEVELOPMENT, MARKETING, SUPER_ADMIN } = orgUserRole;

routes.get('/all-startups', roleVerifier(SUPER_ADMIN), getAllStartups);
routes.get('/all-members', roleVerifier(SUPER_ADMIN), getAllMembers);
// routes.post('/login', loginAdmin);

// router.post('/forget-pass', zodValidator(forgetPassZodSchema), AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   zodValidator(AuthValidations.refreshTokenZodSchema),
//   AuthControllers.getAccessTokenByRefreshToken
// );

module.exports = routes;
