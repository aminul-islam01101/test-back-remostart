const express = require('express');

const teamRouter = express.Router();

teamRouter.get('/', async (req, res) => {
    res.send('team route is ok');
});

// router.post('/forget-pass', zodValidator(forgetPassZodSchema), AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   zodValidator(AuthValidations.refreshTokenZodSchema),
//   AuthControllers.getAccessTokenByRefreshToken
// );

module.exports = teamRouter;
