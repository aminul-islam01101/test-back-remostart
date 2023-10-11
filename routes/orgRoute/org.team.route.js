const express = require('express');
const {inHouseStartups}= require('../../controllers/orgControllers/org.team.controllers');

const teamRouter = express.Router();

teamRouter.get('/inhouse-startups',inHouseStartups);

// router.post('/forget-pass', zodValidator(forgetPassZodSchema), AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   zodValidator(AuthValidations.refreshTokenZodSchema),
//   AuthControllers.getAccessTokenByRefreshToken
// );

module.exports = teamRouter;
