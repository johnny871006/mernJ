const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const passport = require("passport");
require("./config/passport")(passport);
const courseRoute = require("./routes").course;
const cors = require("cors");

//connect to mongodb
mongoose
  .connect("mongodb://localhost:27017/mernDB")
  .then(() => {
    console.log("連接到mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api/user", authRoute);
// course route應該被jwt保護
// 如果request header內部沒有jwt，則request會被視為unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// 只有登入系統的人，才能新增或註冊課程

app.listen(8080, () => {
  console.log("後端伺服器運行在8080");
});
