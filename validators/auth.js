const { check, validationResult } = require('express-validator');

exports.validateSignupRequest = [
    check("user.userName").notEmpty().withMessage("Cannot be empty."),
    check("user.email").isEmail().withMessage("Invalid Email."),
    check("user.password")
        .isLength({ min: 8 })
        .withMessage("Password must be atleast 8 characters long"),
];

exports.validateSigninRequest = [
    check("user.email").isEmail().withMessage("Incorrect email or password."),
    check("user.password")
        .isLength({ min: 8 })
        .withMessage("Incorrect email or password."),
];

exports.isRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }
    next();
};