const mongoose=require('mongoose');
const schema=mongoose.Schema;
const user = new schema({
    name: { type: String, required: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: "User" },
    emailVerificationToken: { type: String },
    emailVerified: { type: Boolean, default: false },
    oauthProvider: { type: String },
    oauthId: { type: String }, 
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
}, { timestamps: true });

const User=mongoose.model('users',user);
module.exports=User;