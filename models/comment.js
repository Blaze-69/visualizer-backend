const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        commentBody: {
            type: String,
            trim: true,
        },
        isEdited: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);