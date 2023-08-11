const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/userRoutes");
const globalMiddleware = require("./middlewares/errorMiddleware");
const AppError = require("./utils/appError");

const app = express();
app.use(express.json({}));
app.use(cookieParser());

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => console.log(`Database connected successfully!🥰 🥰 🥰`))
  .catch(err => console.log(`Error - 🎇🎇🎇 ${err.message}`));

app.use("/api/v1/auth", userRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalMiddleware);

port = process.env.PORT;
app.listen(port, () => console.log(`Server is listening on port ${port}`));
