const { Router } = require("express");
const router = Router();

/** import all controllers */
const appController = require('../controller/appController');
const { Auth, localVariables } = require("../middleware/auth");
const { registerMail } = require("../controller/mailer");

/** POST Methods */

// Register User
router.post('/register', appController.register);

// Send the Email
router.post('/registerMail', registerMail);

// Authenticate User
router.post('/authenticate', appController.verfiyUser, async (req, res) => {
    res.end();
})

// Login the User
router.post('/login', appController.verfiyUser, appController.login)


/** GET Methods */

// User with Username
router.get('/user/:username', appController.getUser);

// Generate Random OTP
router.get('/generateOTP', appController.verfiyUser, localVariables, appController.generateOTP);

// Verify Generated OTP
router.get('/verifyOTP', appController.verfiyUser, appController.verifyOTP);

// Reset all the variables
router.get('/createResetSession', appController.createResetSession);


/** PUT Methods */

// Update the user profile
router.put('/updateUser', Auth, appController.updateUser);

// Reset Password
router.put('/resetPassword', appController.verfiyUser, appController.resetPassword);

module.exports = router;