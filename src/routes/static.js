const express = require("express");
const job = require("../modles/job.js");
const router = express.Router();
const User = require("../../usermodles.js");
const jwt = require("jsonwebtoken");
const secret = "devpriya$123@";

router.get("/jobs", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const alljobs = await job.find({ createdBy: req.user._id });
  return res.render("index", {
    jobs: alljobs,
  });
});

router.get("/", async(req, res) => {
  const token = req.cookies?.token;

    let userId;

    if(token) userId = jwt.verify(token, secret);

    const user = await User.findById(userId?.id);

    res.locals.user = user;

 
  res.render("index",{
    user:user,
  });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/login", (req, res) => {
  res.render("login");
});

module.exports = router;
