const { Router } = require("express");
const authMiddleWare = require("../middleware/authMiddleware");
const {
  createPost,
  getPosts,
  getSinglePost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
} = require("../controllers/postControllers");

const router = Router();

router.post("/", authMiddleWare, createPost);
router.get("/", getPosts);
router.get("/categories/:category", getCatPosts);
router.get("/users/:id", getUserPosts);
router.get("/:id", getSinglePost);
router.patch("/:id", authMiddleWare, editPost);
router.delete("/:id", authMiddleWare ,deletePost);

module.exports = router;
