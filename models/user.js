const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
        hash_password: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

userSchema.virtual("password").set((password) => {
    this.hash_password = bcrypt.hashSync(password, saltRounds);
});

userSchema.methods = {
    authenticate: (password) => {
        return bcrypt.compareSync(password, this.hash_password);
    },
};

module.exports = mongoose.model("User", userSchema);
