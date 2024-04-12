const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  otp: String,
  phoneNumber: {
    type: String,
  },
  email: {
    type: String,
    unique: true
  },
  passward:{
    type: String,
  },
  firstName: String,
  lastName: String,
  gender: String,
  dob: String,
  
  point: Number,
  ip: String,
  os: String,
  blocked: {
    type: Boolean,
    default: false,
  }, 
  supportEvent: {
    type: Boolean,
    default: false
  },
  isConnected: {
    type: Boolean,
    default: false
  },
  bankName : String,
  branchName : String,
  accountHolderName: String, 
  bankAccountNumber:String,
  ifscCode: String,
  aadhar: String,
  pan: String,
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
