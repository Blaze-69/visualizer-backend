const express = require('express');
const { signin, signup } = require('../controllers/auth');
const { validateSigninRequest, isRequestValidated, validateSignupRequest } = require('../validators/auth');
const router = express.Router();

router.post("/signin", validateSigninRequest, isRequestValidated, signin);

router.post("/signup", validateSignupRequest, isRequestValidated, signup);

module.exports = router;
