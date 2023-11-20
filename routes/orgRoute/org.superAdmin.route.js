const express = require('express');
const {getAllStartups, getAllMembers, getAllStartupFilters, getAllRemoforce, getAllRemoFilters, getAllTeamFilters,deleteMember}= require('../../controllers/orgControllers/org.superAdmin.controllers');
const { roleVerifier } = require('../../middleware/roleVerifier');
const { orgUserRole } = require('../../constants/org.user.constants');

const routes = express.Router();
const { ADMIN, CONTENT, DEVELOPMENT, MARKETING, SUPER_ADMIN } = orgUserRole;

routes.get('/all-startup/:modifier', roleVerifier(SUPER_ADMIN), getAllStartups);
// routes.get('/all-remoforce/:all', roleVerifier(SUPER_ADMIN), getAllRemoforce);
routes.get('/all-remoforce/:modifier', roleVerifier(SUPER_ADMIN), getAllRemoforce);
routes.get('/all-members', roleVerifier(SUPER_ADMIN), getAllMembers);
routes.get('/all-team-filters', roleVerifier(SUPER_ADMIN), getAllTeamFilters);
routes.delete('/delete-member/:email', roleVerifier(SUPER_ADMIN), deleteMember);
routes.get('/all-startup-filters', roleVerifier(SUPER_ADMIN), getAllStartupFilters);
routes.get('/all-remo-filters', roleVerifier(SUPER_ADMIN), getAllRemoFilters);

// routes.post('/login', loginAdmin);

// router.post('/forget-pass', zodValidator(forgetPassZodSchema), AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   zodValidator(AuthValidations.refreshTokenZodSchema),
//   AuthControllers.getAccessTokenByRefreshToken
// );

module.exports = routes;
