const job = require("../modles/job.js");
const user = require("../usercontroler.js");

async function getAllUserJobs(req, res) {
  if (!req.user) return res.redirect("/login");

  const alljobs = await job.find({ createdBy: req.user._id });

  return res.status(200).json({
    jobs: alljobs,
  });
}

module.exports = { getAllUserJobs };
