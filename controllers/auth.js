const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.signin = (req, res) => {
    console.log(req.body);
    const { user } = req.body;
    console.log("sign",user);

    User.findOne({ email: user.email }).exec((error, existingUser) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (existingUser) {
            if (existingUser.authenticate(user.password)) {

                const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET, {
                    expiresIn: "24h",
                });

                res.status(200).json({ token, user: existingUser });
            }
            else {
                return res.status(400).json({ error: "Invalid email or password" });
            }
        }
        else {
            return res.status(400).json({ error: "Invalid email or password" });
        }
    });
};

exports.signup = (req, res) => {

    const { user } = req.body;

    User.findOne({ email: user.email }).exec((error, existingUser) => {
        if (error) {
            return res.status(400).json({ error });
        }
        if (existingUser) {
            return res.status(400).json({ message: "User with that email already exist"});
        }
        else {
              user.password = bcrypt.hashSync(user.password, saltRounds);

              const _user = new User(user); 

              _user.save((error, data) => {
              if (error) {
                    return res.status(400).json({ error });
                    }

              if (data) {
                     return res.status(200).json({
                message: "Registration Successful", user:_user
            });
                     }
           });

        }
    });

};
