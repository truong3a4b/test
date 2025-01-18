// In Progress
const express = require("express");
const router = express.Router();
const { Posts } = require("../models");
const { validateToken } = require("../middleware/auth");
const { Op } = require("sequelize");

// Get list of posts with filterConditions
router.get("/", validateToken, async (req, res) => {
  const user_id = req.user["user"].id;
  const { description, createdAt, page = 1, limit = 10, userId } = req.query;

  const filterConditions = {};

  if (description) {
    filterConditions.description = {
      [Op.like]: `%${description}%`,
    };
  }

  if (userId) {
    filterConditions.user_id = userId
  }

  if (createdAt) {
    filterConditions.createdAt = {
      [Op.gte]: new Date(`${createdAt}T00:00:00`),
      [Op.lt]: new Date(`${createdAt}T23:59:59`),
    };
  }

  try {
    const offset = (page - 1) * limit;
    const userPosts = await Posts.findAndCountAll({
      where: filterConditions,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    if (userPosts.rows.length === 0) {
      return res.status(404).json({ message: "No posts found for this user." });
    }

    res.json({
      posts: userPosts.rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(userPosts.count / limit),
      totalPosts: userPosts.count,
    });
  } catch (error) {
    console.error("Error fetching user posts:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving posts." });
  }
});

// Get a post by Post ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Posts.findByPk(id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ error: "Post not found" });
    }
  } catch (error) {
    console.error("Error fetching post: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create a new post
router.post("/", validateToken, async (req, res) => {
  const user_id = req.user["user"].id;
  const { description, attachment } = req.body;

  try {
    const newPost = await Posts.create({
      user_id,
      description,
      attachment,
    });

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error.message);
    res
      .status(500)
      .json({ error: "Error creating post", details: error.message });
  }
});

// Update post by ID
router.put("/:id", validateToken, async (req, res) => {
  const userId = req.user["user"].id;
  const { id } = req.params;
  const { description, attachment } = req.body;

  try {
    const post = await Posts.findOne({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this post." });
    }

    await Posts.update(
      { description, attachment },
      { where: { id } }
    );

    const updatedPost = await Posts.findOne({ where: { id } });

    res.json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error updating post:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while updating the post." });
  }
});

// Delete post by ID
router.delete("/:id", validateToken, async (req, res) => {
  const userId = req.user["user"].id;
  const { id } = req.params;

  try {
    const post = await Posts.findOne({ where: { id } });

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }
    if (post.user_id !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post." });
    }

    await Posts.destroy({ where: { id } });

    res.json({ message: "Post deleted successfully." });
  } catch (error) {
    console.error("Error deleting post:", error.message);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post." });
  }
});

module.exports = router;
