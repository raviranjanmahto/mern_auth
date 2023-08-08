const AppError = require("../utils/appError");

const handleDuplicateFieldDb = err => {
  const name = Object.keys(err.keyValue)[0];
  const value = Object.values(err.keyValue)[0];
  const message = `Duplicate field "${name}: ${value}". Please use another ${name}!`;
  return new AppError(message, 409);
};

const handleValidationErrorDb = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpireError = () =>
  new AppError("Your token has expired! Please log in again!", 401);

// GLOBAL ERROR MIDDLEWARES
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went very wrong!";

  if (err.code === 11000) err = handleDuplicateFieldDb(err);
  if (err.name === "ValidationError") err = handleValidationErrorDb(err);
  if (err.name === "JsonWebTokenError") err = handleJWTError(err);
  if (err.name === "TokenExpiredError") err = handleJWTExpireError(err);

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err?.stack,
  });
};
