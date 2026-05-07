const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },

  password: { type: String, required: true },

  phone: { type: String },
  location: { type: String },

  role: { 
    type: String, 
    enum: ['user', 'employee', 'admin'], 
    default: 'user' 
  },

  isVerified: { type: Boolean, default: false }

}, { timestamps: true });


// 🔐 Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});


// 🔑 Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);