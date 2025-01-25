const express = require("express");
const job = require("../modles/job.js");
const router = express.Router();

router.get("/jobs", async (req, res) => {
  if (!req.user) return res.redirect("/login");
  const alljobs = await job.find({ createdBy: req.user._id });
  return res.render("job", {
    jobs: alljobs,
  });
});

router.get("/", (req, res) => {
  return res.render("job");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router;
