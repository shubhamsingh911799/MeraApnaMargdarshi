const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const ApiError = require("../utils/ApiError");
const config = require("../config/config");


/* =========================================================
   CREATE JWT TOKEN
========================================================= */

const createToken = (userId) => {

  return jwt.sign(
    {
      userId,
    },

    config.jwtSecret,

    {
      expiresIn:
        config.jwtExpire || "7d",
    }

  );

};




/* =========================================================
   NORMALIZE EMAIL
========================================================= */

const normalizeEmail = (email) => {

  return String(email || "")
    .trim()
    .toLowerCase();

};





/* =========================================================
   REGISTER USER SERVICE
========================================================= */

const registerUserService = async ({
  name,
  email,
  password,
}) => {


  const normalizedEmail =
    normalizeEmail(email);



  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });



  if (existingUser) {

    throw new ApiError(
      409,
      "Email is already registered."
    );

  }




  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );




  const user =
    await User.create({

      name: name.trim(),

      email: normalizedEmail,

      password: hashedPassword,

      role: "user",

    });




  const token =
    createToken(user._id);



  return {

    user,

    token,

  };

};







/* =========================================================
   LOGIN USER SERVICE
========================================================= */

const loginUserService = async ({
  email,
  password,
}) => {



  const normalizedEmail =
    normalizeEmail(email);




  const user =
    await User.findOne({

      email: normalizedEmail,

    })
    .select("+password");





  if (!user) {

    throw new ApiError(
      401,
      "Invalid email or password."
    );

  }




  const isPasswordValid =
    await bcrypt.compare(
      password,
      user.password
    );




  if (!isPasswordValid) {

    throw new ApiError(
      401,
      "Invalid email or password."
    );

  }




  const token =
    createToken(user._id);




  return {

    user,

    token,

  };

};







/* =========================================================
   GET USER BY ID SERVICE
========================================================= */

const getUserByIdService = async (
  userId
) => {



  const user =
    await User.findById(
      userId
    );




  if (!user) {

    throw new ApiError(
      404,
      "User not found."
    );

  }




  return user;

};







module.exports = {

  registerUserService,

  loginUserService,

  getUserByIdService,

};