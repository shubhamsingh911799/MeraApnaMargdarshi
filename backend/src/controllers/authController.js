const asyncHandler = require("../middleware/asyncHandler");

const {
  registerUserService,
  loginUserService,
  getUserByIdService,
} = require("../services/authService");

const ApiResponse = require("../utils/ApiResponse");


// REGISTER USER
const registerUser = asyncHandler(async (req, res) => {

  const {
    name,
    email,
    password
  } = req.body;


  const {
    user,
    token
  } = await registerUserService({
    name,
    email,
    password
  });


  return res.status(201).json(
    new ApiResponse(
      201,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      "Registration successful"
    )
  );

});



// LOGIN USER
const loginUser = asyncHandler(async (req, res) => {

  const {
    email,
    password
  } = req.body;


  const {
    user,
    token
  } = await loginUserService({
    email,
    password
  });


  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
      },
      "Login successful"
    )
  );

});



// CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {

  const user = await getUserByIdService(req.user.id);


  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user
      },
      "User profile fetched successfully"
    )
  );

});



// UPDATE USER PROFILE (NAME, AVATAR, EMAIL)
const updateUserProfile = asyncHandler(async (req, res) => {
  const User = require('../models/User');
  const userId = req.user.id || req.user._id;

  const { name, email, avatar, currentPassword, newPassword } = req.body;
  const user = await User.findById(userId).select('+password');

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, 'User not found'));
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (avatar !== undefined) user.avatar = avatar;

  if (newPassword && String(newPassword).trim() !== '') {
    const bcrypt = require('bcryptjs');
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json(new ApiResponse(400, null, 'Current password is incorrect'));
      }
    }
    user.password = await bcrypt.hash(newPassword, 10);
  }

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar || '',
          role: user.role,
        },
      },
      'Profile updated successfully'
    )
  );
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateUserProfile,
};