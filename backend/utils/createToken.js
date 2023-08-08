const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

exports.createToken = asyncHandler((res, user, statusCode) => {
  const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "30d",
  });
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.status(statusCode).json({
    status: "success",
    token,
    data: { id: user._id, name: user.name, email: user.email },
  });
});
