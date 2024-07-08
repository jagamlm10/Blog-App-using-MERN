const User = require("../models/userModels");
const HttpError = require("../models/errorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");











/*==================== REGISTER NEW USER ======================*/
// POST : /api/users/register
// UNPROTECTED

const registerUser = async (req, res, next) => {
  try {
    const { name, email, password1, password2 } = req.body;

    // If some parameter is missing
    if (!name || !email || !password1) {
      return next(new HttpError("Fill in all fields!!", 422));
    }

    const newEmail = email.toLowerCase(); // Converting email address to lowercase
    const emailExists = await User.findOne({ email: newEmail }); // Checking the database if email already exists
    // If email already exists
    if (emailExists) {
      return next(new HttpError("Email already exists", 422));
    }
    // If Pasword and Confirm Password do not match
    if (password1 !== password2) {
      return next(new HttpError("Passwords do not match!!", 422));
    }

    // Length of the password should be greater than 6 characters
    if (password1.trim().length < 6) {
      return next(
        new HttpError(
          "Length of the password should atleast be 6 characters..",
          422
        )
      );
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password1, salt);

    // Adding the new user to the database
    const newUser = await User.create({
      name: name,
      email: newEmail,
      password: hashedPass,
    });
    res.status(201).json(`New user ${newUser.email} registered.`);
  } catch (error) {
    console.log(error);
    return next(new HttpError("User Registration failed", 422));
  }
};











/*==================== LOGIN REGISTERD USER ======================*/
// POST : /api/users/login
// UNPROTECTED

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // Check if we have all the credentials
    if (!email || !password) {
      return next(new HttpError("Missing Credentials", 422));
    }
    const newEmail = email.toLowerCase();

    // Check if the user exists
    const user = await User.findOne({ email: newEmail });
    if (!user) {
      return next(
        new HttpError("User does not exist. Please register first...", 422)
      );
    }

    // If the user exists, then check if password matches the one within the database
    const comparePass = await bcrypt.compare(password, user.password);
    if (!comparePass) {
      return next(new HttpError("Invalid username or password", 422));
    }

    // Return an access token that expires in 1 day
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({ name: user.name, id: user._id, token: token });
  } catch (error) {
    console.log(error);
    return next(new HttpError("Login Failed!!", 422));
  }
};











/*==================== GET USER PROFILE ======================*/
// GET : /api/users/:id
// PROTECTED
const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new HttpError("User not found", 422));
    }
    res.status(201).json(user);
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*==================== GET AUTHORS ======================*/
// GET : /api/users
// PROTECTED
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError(error));
  }
};











/*==================== CHANGE USER AVATAR ======================*/
// POST : /api/users/change-avatar
// PROTECTED
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files) {
      return next(new HttpError("Please upload an image", 422));
    }
    // Find the current user in the database
    const user = await User.findById(req.user.id).select("-password");

    // If the image size is greater than 500kb then we cannot upload it
    if (req.files.avatar.size > 500000) {
      return next(
        new HttpError("File size too big. Please upload size below 500kb")
      );
    }

    // If user already has an avatar then delete it from the uploads folder
    if (user.avatar) {
      try {
        await fs.promises.unlink(
          path.join(__dirname, "..", "uploads", user.avatar)
        );
      } catch (e) {
        // Continue even if there's an error deleting the old avatar
        console.error("Error deleting old avatar:", e);
      }
    }

    // Before updating the avatar of the user, we have to rename the file to something unique,
    // and this new unique name is what we are going to store as the users avatar inside the database.
    // In database we only store the name of the image. The actual image is stored in the server in the uploads folder.
    // Thats the reason why we had to serve the static files inside uploads folder.

    const { avatar } = req.files; // Extracting the entire image as an object inside avatar variable.
    let splitName = avatar.name.split(".");
    let newFileName =
      splitName[0] + uuid() + "." + splitName[splitName.length - 1];
    avatar.mv(path.join(__dirname, "..", "uploads", newFileName), async (e) => {
      // If we encounter some kind of error then
      if (e) {
        return next(new HttpError(e));
      }
    });

    // Get the user id of the user that is currently logged in and update its avatar
    const updatedAvatar = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: newFileName },
      { new: true }
    );
    // Setting {new : true} will give us back the new updated user

    // Check if the user got updated
    if (!updatedAvatar) {
      return next(new HttpError("Unable to change the avatar", 422));
    }

    // If everything okay then send json response containing updated User
    res.status(201).json(updatedAvatar);
  } catch (error) {
    console.log(error);
    return next(new HttpError(error));
  }
};











/*==================== EDIT USER DETAILS ======================*/
// PATCH : /api/users/edit-user
// PROTECTED
const editUser = async (req, res, next) => {
  try {
    // Extract all variables
    const { Name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // Check if any of the credentials are missing or not
    if (!email || !Name || !currentPassword || !newPassword) {
      console.log(
        Name,
        email,
        currentPassword,
        newPassword,
        confirmNewPassword
      );
      return next(new HttpError("Fill in all the fields!!", 422));
    }

    const user = await User.findById(req.user.id); // Get the user fom database

    // Check if there is such a user in the database
    if (!user) {
      return next(new HttpError("User does not exists", 422));
    }

    const newEmail = email.toLowerCase(); // Convert email to lowercase
    const emailExists = await User.findOne({ email: newEmail }); // Check if the provided email already exists in database or not

    // If the email already exists and it is not the same as the email of the current user ,
    // then that means that we are using someone elses email and that should not happen.
    // Checking if the id ogf the emailExists and req.user.id match or not
    if (emailExists && req.user.id != emailExists._id) {
      return next(
        new HttpError("The email you have provided already exists", 422)
      );
    }
    // Checking if the current password matches with the password inside the database
    const compare = await bcrypt.compare(currentPassword, user.password);
    if (!compare) {
      return next(new HttpError("Please enter correct current password", 422));
    }

    // Check if the new password ans confirm new password match or not
    if (newPassword !== confirmNewPassword) {
      return next(
        new HttpError("new password and confirm password do not match", 422)
      );
    }

    const salt = await bcrypt.genSalt(10); // Creating salt for encryption/decryption
    const hashPass = await bcrypt.hash(newPassword, salt); // Hashing the new password

    // Update user in the database
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { name: Name, email: newEmail, password: hashPass },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    return next(new HttpError(error));
  }
};



module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAuthors,
  editUser,
  changeAvatar,
};
