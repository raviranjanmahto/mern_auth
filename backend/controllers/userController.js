const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const { createToken } = require("../utils/createToken");
const AppError = require("../utils/appError");

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });
  createToken(res, user, 201);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("All fields are required!", 401));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password)))
    return next(new AppError("Invalid email or password!", 401));

  createToken(res, user, 200);
});

exports.logout = asyncHandler((req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ status: "success" });
});

exports.getProfile = asyncHandler((req, res) => {
  const data = { id: req.user._id, name: req.user.name, email: req.user.email };
  res.status(200).json({ status: "success", data });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;
  const user = await User.findById(req.user._id);
  if (email) user.email = email;
  if (name) user.name = name;
  if (password) user.password = password;

  await user.save();

  res.status(200).json({
    status: "success",
    data: { id: user._id, name: user.name, email: user.email },
  });
});
