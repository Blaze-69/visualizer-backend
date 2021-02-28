const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        userName: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        email: {
            type: String,
            trim: true,
            unique: 1,
        },
        password: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

userSchema.methods = {
    authenticate: function (userPassword) {
        return bcrypt.compareSync(userPassword, this.password);
    },
};

module.exports = mongoose.model("User", userSchema);
