const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

//User
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName:{type: String, required: true},
  lastName:{ type: String, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "employer", "customer"],
    default: "customer",
  },
  isActive: {
    type: Boolean,
    enum: ["active", "block"],
    default: true,
  },
  isDeleted: {
    type: Boolean,
    enum: ["active", "block"],
    default: false,
  },
  createAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  otp: {
    type: String,
    default: null,
  },
  otpExpire: {
    type: Date,
    default: null,
  },
});

userSchema.pre('save', async function(next) {
    if(!this.isModified("password") ){
        return next();
    }
    this.password= await bcrypt.hash(this.password,10);
    next();
});

userSchema.methods.comparePassword = function (password){
    return bcrypt.compare(password, this.password);
}

userSchema.methods.softDelete = function (){
  this.isDeleted = true;
  return this.save();
}

module.exports = mongoose.model('User', userSchema);