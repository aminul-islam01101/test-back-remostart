const express = require('express');
const { loginAdmin } = require('../../controllers/orgControllers/org.superAdmin.controllers');

const adminRouter = express.Router();

adminRouter.get('/', async (req, res) => {
    res.send('admin route is ok');
});
adminRouter.post('/login', loginAdmin);

// router.post('/forget-pass', zodValidator(forgetPassZodSchema), AuthControllers.resetPassword);
// router.post(
//   '/refresh-token',
//   zodValidator(AuthValidations.refreshTokenZodSchema),
//   AuthControllers.getAccessTokenByRefreshToken
// );

module.exports = adminRouter;
