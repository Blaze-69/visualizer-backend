const Comment = require("../models/comment");
const Algorithm = require("../models/algorithm");

exports.allComments = (req, res) => {
    const { algoId } = req.params;

    Algorithm.findById(algoId)
        .populate({
            path: "comments",
            model: "Comment",
            populate: {
                path: "userId",
                model: "User",
            }
        })
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({ error });
            }
            if (data) {
                return res.status(200).json({ comments: data.comments });
            }
        });
};

exports.addComment = (req, res) => {
    const { commentBody, algoId, userId } = req.body;

    const _comment = new Comment({ commentBody, userId });

    _comment.save((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (data) {
            Algorithm.updateOne(
                { _id: algoId },
                { $push: { comments: [data._id] } },
            )
                .exec((error, data) => {
                    if (error) {
                        return res.status(400).json({ error: "Something went wrong" });
                    }
                    if (data) {
                        return res.status(200).json({ message: "Your comment has been successfully added." });
                    }
                });
        }
    });
};

exports.updateComment = (req, res) => {
    const { commentId, commentBody } = req.body;

    Comment.updateOne(
        { _id: commentId },
        {
            commentBody,
            isEdited: true,
        }
    )
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({ error: "Something went wrong" });
            }
            if (data) {
                return res.status(200).json({ message: "Your comment has been successfully updated." });
            }
        });
};

exports.deleteComment = (req, res) => {
    const { commentId, algoId } = req.body;

    Algorithm.findByIdAndUpdate(algoId, { $pull: { comments: commentId } })
        .exec((error, data) => {
            if (error) {
                return res.status(400).json({ error: "Something went wrong" });
            }

            if (data) {
                Comment.findByIdAndDelete(commentId)
                    .exec((error, data) => {
                        if (error) {
                            return res.status(400).json({ error: "Something went wrong" });
                        }
                        if (data) {
                            return res.status(200).json({ message: "Your comment has been successfully deleted." });
                        }
                    });
            }

        });
};