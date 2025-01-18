// Not Started
// Not Started
// Not Started
const express = require("express");
const router = express.Router();
const { PostComments } = require("../models");

// Lấy danh sách tất cả các bình luận
router.get("/", async (req, res) => {
  try {
    const comments = await PostComments.findAll();
    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lấy một bình luận theo ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await PostComments.findByPk(id);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error fetching comment: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Tạo một bình luận mới
router.post("/", async (req, res) => {
  const { post_id, user_id, comment } = req.body;
  try {
    const newComment = await PostComments.create({
      post_id,
      user_id,
      comment,
    });
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Cập nhật một bình luận theo ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { post_id, user_id, comment } = req.body;
  try {
    const commentToUpdate = await PostComments.findByPk(id);
    if (commentToUpdate) {
      commentToUpdate.post_id = post_id;
      commentToUpdate.user_id = user_id;
      commentToUpdate.comment = comment;
      await commentToUpdate.save();
      res.json(commentToUpdate);
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error updating comment: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Xóa một bình luận theo ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const commentToDelete = await PostComments.findByPk(id);
    if (commentToDelete) {
      await commentToDelete.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Comment not found" });
    }
  } catch (error) {
    console.error("Error deleting comment: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
