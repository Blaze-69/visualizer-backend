const express = require("express");
const router = express.Router();
const { commentValidated, isCommentValidated } = require("../validators/comment");
const { requireSignin } = require("../middlewares/index");
const { allComments, addComment, updateComment, deleteComment } = require("../controllers/comment");

router.get("/comment", requireSignin, allComments);
router.post("/comment", requireSignin, commentValidated, isCommentValidated, addComment);
router.patch("/comment", requireSignin, commentValidated, isCommentValidated, updateComment);
router.delete("/comment", deleteComment);

module.exports = router;