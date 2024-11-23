import mongoose from 'mongoose';
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
  email: { type: String, required: true, lowercase: true, unique: true },
  slug: { type: String },
  otp: { type: String },
  otpExpires: { type: Date },  // Change otpexpire to otpExpires
  isVerified: { type: Boolean, default: false },
  isVerifiedOtp: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('user', userSchema);
export default User;