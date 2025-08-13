// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, required: true, lowercase: true, index: true  },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user','admin'], default: 'user' },

  // new mobile sub‐document
  mobile: {
    countryCode: { type: String, required: true },
    phoneNumber:  { type: String, required: true }
  },
   // NEW: block/unblock
  status: { type: String, enum: ['active', 'blocked'], default: 'active', index: true },
  
  // email verification
  isEmailVerified:      { type: Boolean, default: false },
  emailOtpCode:         { type: String },
  emailOtpExpires:      { type: Date }
},{
  timestamps: true,
  versionKey: false
});

export default mongoose.model('User', userSchema);
