const mongoose = require('mongoose');

const algoSchema = mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Algorithm", algoSchema);
