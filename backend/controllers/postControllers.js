// /api/posts
const Post = require("../models/postModel");
const User = require("../models/userModels");
const HttpError = require("../models/errorModel");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");











/*===========================CREATE POST=============================*/
// PROTECTED
// POST    /

const createPost = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description || !req.files) {
      return next(new HttpError("Please fill all the fields", 422));
    }

    const { thumbnail } = req.files;
    
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Image size greater than 2MB, Reduce it.", 422)
      );
    }
    let fileName = thumbnail.name;
    let splitName = fileName.split(".");
    let newFileName =
      splitName[0] + uuid() + "." + splitName[splitName.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        } else {
          const creator = req.user.id;
          const newPost = await Post.create({
            title,
            category,
            description,
            creator,
            thumbnail: newFileName,
          });
          if (!newPost) {
            return next(new HttpError("Couldn't create post", 422));
          }
          const currentUser = await User.findById(creator);
          const posts = currentUser.posts + 1;
          await User.findByIdAndUpdate(creator, { posts }, { new: true });

          res.status(201).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*===========================GET POSTS=============================*/
// UNPROTECTED
// GET     /

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updatedAt: -1 });
    res.status(201).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*===========================GET SINGLE POST=============================*/
// UNPROTECTED
// GET     /:id

const getSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next("Post not found", 404);
    }
    res.status(201).json(post);
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*===========================GET POST BY CATEGORIES=============================*/
// UNPROTECTED
// GET     /categories/:category

const getCatPosts = async (req, res, next) => {
  try {
    const category = req.params.category;
    const posts = await Post.find({ category }).sort({ updatedAt: -1 });
    res.status(201).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*===========================GET POST BY USER=============================*/
// UNPROTECTED
// GET     /users/:id

const getUserPosts = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const posts = await Post.find({ creator: userId }).sort({ updatedAt: -1 });
    res.status(201).json(posts);
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*===========================EDIT POST=============================*/
// PROTECTED
// PATCH     /:id

const editPost = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    // Check whether all parameters are provided or not
    if (!title || !category || description.length < 12) {
      return next(new HttpError("Fill all fields"), 422);
    }
    // Checking whether this post belongs to the current user or not
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (post.creator != req.user.id) {
      return next(new HttpError("Cannot edit someone elses post!!", 401));
    }
    // If thumbnail not uploaded the update the post without it
    if (!req.files) {
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, description, category },
        { new: true }
      );
      res.status(201).json(updatedPost);
    } else {
      const { thumbnail } = req.files;
      // Size of the file should not exceed 2MB
      if (thumbnail.size > 2000000) {
        return next(new HttpError("File size shiuld be less than 2MB", 422));
      }

      const oldPost = await Post.findById(postId);
      // If the post already has a thumbnail then first delete it
      if (oldPost.thumbnail) {
        try {
          await fs.promises.unlink(
            path.join(__dirname, "..", "uploads", oldPost.thumbnail)
          );
        } catch (error) {
          return next(new HttpError(error));
        }
      }
      // Generating a new name for the thumbnail
      let splitName = thumbnail.name.split(".");
      let newFileName =
        splitName[0] + uuid() + "." + splitName[splitName.length - 1];
      // Moving the thumbnail to uploads folder and renamining it.
      thumbnail.mv(
        path.join(__dirname, "..", "uploads", newFileName),
        async (err) => {
          if (err) {
            return next(new HttpError("Could not upload the thumbnail"));
          }

          // Thubnail uploaded succefully so now make changes in the database
          const updatedPost = await Post.findByIdAndUpdate(postId, {
            title,
            description,
            category,
            creator: oldPost.creator,
            thumbnail: newFileName,
          });

          // If post could not be updated then throw error
          if (!updatedPost) {
            return next(new HttpError("Could not update the post"), 422);
          }

          res.status(201).json(updatedPost);
        }
      );
    }
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*===========================DELETE POST=============================*/
// PROTECTED
// DELETE     /:id

const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId); // Fetch post from database

    // If post not in database throw error
    if (!post) {
      return next(new HttpError("Post not found"), 404);
    }

    // Check if the creator of the post and current user are the same or not
    const userId = req.user.id;
    if (post.creator != userId) {
      return next(new HttpError("You cannot delete someone elses post", 401));
    }

    const fileName = post?.thumbnail;

    if (fileName) {
      try {
        await fs.promises.unlink(
          path.join(__dirname, "..", "uploads", fileName)
        );
      } catch (error) {
        return next(new HttpError(error), 422);
      }
    }

    await Post.findByIdAndDelete(postId); // Deleting post from database

    // Decrease the posts count of the user by 1
    const user = await User.findById(userId);
    const posts = user.posts - 1;
    await User.findByIdAndUpdate(userId, { posts: posts });

    // Response message
    res.status(200).json(`Post with the id ${postId} has been deleted`);
  } catch (error) {
    return next(new HttpError(error));
  }
};

module.exports = {
  createPost,
  getPosts,
  getSinglePost,
  getCatPosts,
  getUserPosts,
  editPost,
  deletePost,
};
