import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { hashPassword, comparePassword } from "../middleware/authHelper.js";
import JWT from "jsonwebtoken";
import { access } from "fs";

// Controller for Login
export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.send({
        success: false,
        message: "Both email and password fields are required.",
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      const matched = await comparePassword(password, user.password);
 
      if (!matched) {
        return res.send({
          success: false,
          message: "Invalid password, please try again.",
        });
      }
   
      const AccessToken = JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1y",
      });
      return res.status(200).send({
        success: true,
        message: "Login successful",
        user,
        AccessToken,
      });
    }

    return res.send({ success: false, message: "User not registered." });

  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server issue", error });
  }
};

export const logoutController = async (req, res) => {
  try {
    res.clearCookie("token")
    
    return res.send({ success: true, message: "Logout success" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server issue", error });
  }
};



export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send('No user with that email');
    }

    // Generate OTP and hash it
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = crypto.createHash('sha256').update(otp).digest('hex');
    user.otpExpires = Date.now() + 3 * 60 * 1000; // OTP expires in 3 minutes
    await user.save({ validateBeforeSave: false });

    // Send OTP via email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,  // Your Gmail username
        pass: process.env.EMAIL_PASS,  // Your Gmail password
      },
    });

    const mailOptions = {
      from: `"Bellissimo interiors zone" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset OTP',
      text: `Your password reset OTP is: ${otp}. This OTP is valid for 3 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).send('OTP sent to email');
  } catch (err) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error(err);
    return res.status(500).send('Internal server issue');
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send('All fields are required');
  }

  const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

  const user = await userModel.findOne({
    email,
    otp: hashedOtp,
    otpExpires: { $gt: Date.now() }, // Check if OTP is still valid
  });

  if (!user) {
    return res.status(400).send('OTP is invalid or has expired');
  }

  // Hash the new password before saving
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(newPassword, salt);
  user.otp = undefined; // Clear OTP
  user.otpExpires = undefined; // Clear OTP expiry
  await user.save();

  return res.status(200).send('Password has been reset');
};