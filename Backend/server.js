const express = require("express");
const cors = require("cors");
const linkedinLogin = require("./linkedin.js");
const sendMail = require("./mailer.js");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

//multer storage working
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.post("/linkedin", upload.single("resume"), async (req, res) => {
  const { keyword, gmail, appPassword } = req.body;
  const resumePath = req.file.path;
  const result = await linkedinLogin(keyword, gmail, appPassword, resumePath);

  res.json(result);
  
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
