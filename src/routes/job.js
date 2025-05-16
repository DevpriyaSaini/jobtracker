const { jobform, getAllUserJobs } = require("../controller/job.js");
const fs = require("fs");
const path = require("path");
const express = require("express");
const job = require("../modles/job.js");
const { checkAuth } = require("../middleware/auth.js");
const router = express.Router();

router.get("/get-all-jobs",checkAuth, getAllUserJobs);

module.exports = router;
