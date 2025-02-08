const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const cors = require("cors");
const staticrouter = require("./routes/static.js");
const {
  restrictToLoggedinUserOnly,
  checkAuth,
} = require("./middleware/auth.js");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const jobRouter = require("./routes/job.js");
const { register, loginuser } = require("../usercontroler.js");
const Job = require("./modles/job.js");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const { log } = require("console");
const job = require("./modles/job.js");
const dotenv = require("dotenv");
const { errorHandler } = require("./middleware/errorHanlder.js");

dotenv.config({
  path: './.env'
});

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);
// app.use("/views", express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.set("view engine", "ejs");


app.set('views', path.join(__dirname, '../views'));

app.use('/public', express.static('public'))

// app.use(staticrouter);

app.get('/', (req, res) => {
  res.render('index')
})

//posting the data

cloudinary.config({
  cloud_name: "dqoiiuabn",
  api_key: "384424856741822",
  api_secret: "ZmcHH6vKwu31ELHEbC_MMS-MC2A",
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/job/create", checkAuth, upload.single("file"), async (req, res) => {
  
  try {
    const { jobTitle, orderValue, date } = req.body;

    if (!jobTitle || !date || !req.file) {
      return res.json({ msg: "all feilds are required!" });
    }

    // Upload file to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "job-uploads", resource_type: "auto",formate:"auto",
        transformation:{width:800,crop:"fill",gravity:"auto"}
       },
      async (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          return res.status(500).json({ message: "Cloudinary upload failed" });
        }
       

        // Create a new Job document
        const newJob = new Job({
          jobTitle,
          orderValue,
          date,
          fileUrl: result.secure_url,
          fileType: req.file.mimetype,
          createdBy: req.user._id,
        });

       

        // Save to MongoDB
        await newJob.save();

        res.redirect("/");
      }
    );

    const readableStream = new Readable();
    readableStream.push(req.file.buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  } catch (error) {
    console.error("Error creating job:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//deleteing job

async function deletejob(req, res) {
 
  try {
    const result = await Job.findByIdAndDelete(req.body.jobId);

    if (!result) {
      console.log("job not found");
      return res.status(200).json({ msg: "user deleted" });
    }

    console.log("job deleted");
  } catch (error) {
    console.log("error deleting job", error.message);
  }
}

app.delete("/delete", deletejob);

//editing job

async function editjob(req, res) {
  const { jobTitle, orderValue, date } = req.body;
  if (!jobTitle || !orderValue || !date) {
    return res.redirect("/");
  }
  try {
    const result = await job.findByIdAndUpdate(
      req.body.jobId,
      {
        jobTitle,
        orderValue,
        date,
      },
      console.log("job updated")
    );

    return res.status(200).json({ msg: "user updated" });
  } catch (error) {
    console.log("error while updating", error.message);
    return res.json({ msg: "error to update user" });
  }
}

app.patch("/update", editjob);

app.use("/job", checkAuth, jobRouter);

app.post("/signup", register);
app.post("/login", loginuser);


app.get("/job", async (req, res) => {
  try {
    const {query} = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const jobs = await Job.find({
      jobTitle: { $regex: query, $options: "i" }, // Case-insensitive search
    });

    res.json({ jobs });
  } catch (error) {
    console.error("Error searching jobs:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});


app.use(errorHandler);




const PORT = process.env.PORT || 3000;
async function connectdb() {
  try {
    const connect = await mongoose.connect(
      "mongodb+srv://devpriyasaini:Anilsaini70177@cluster01.kzupp.mongodb.net/Cluster01"
    );

    app.on('error', (error) => {
      console.log('Error E:', error);
      throw error;
    })

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT});`);
    });
    console.log("mongo connected");
  } catch (error) {
    console.log(error);
  }
}
connectdb();
