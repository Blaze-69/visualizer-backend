const Comment = require("../models/comment");
const Algorithm = require("../models/algorithm");

exports.allComments = (req, res) => {

    Algorithm.find({ name: req.query.name})
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
                return res.status(200).json({ algorithm: data});
            }
        });
};

exports.addComment = (req, res) => {
    const { comment } = req.body;
        console.log(comment);
    const _comment = new Comment({ commentBody:comment.commentBody, userId:comment.userId._id });

    _comment.save((error, data) => {
        if (error) {
            return res.status(400).json({ error });
        }

        if (data) {
            Algorithm.updateOne(
                { _id: comment.algoId },
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
  
    const commentId = req.params.id;
    const commentBody = req.body.comment.commentBody;
    console.log("update",commentId,commentBody);
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
   console.log("delete",req.query.algoId,req.params.id);
    const commentId=req.params.id;
    const algoId = req.query.algoId;
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
