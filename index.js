// import express from "express";
// const app = express();

// const port = 9000;
// app.use("/", (req, res) => {
//   res.json({ message: "Hello from express!" });
// });
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

import express from "express";
import nodemailer from "nodemailer";
import base64ToS3 from "nodemailer-base64-to-s3";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json({ limit: "50mb" }));
app.use(cors());

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

transporter.use(
  "compile",
  base64ToS3({
    /* optional configuration */
  })
);

const sendMail = async (mailOptions) => {
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

app.use("/", async (req, res) => {
  const mailOptions = {
    from: `"Rabi" <${process.env.USER}>`,
    to: "recipient@example.com",
    subject: "Test Email",
    text: "This is a test email sent from Node.js using nodemailer.",
  };

  const result = await sendMail(mailOptions);
  if (result) {
    res.status(200).send("Email sent successfully");
  } else {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
