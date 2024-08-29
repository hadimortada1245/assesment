const mongoose=require('mongoose');
const schema=mongoose.Schema;
const user=new schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    emailVerificationToken: { type: String },
    emailVerified: { type: Boolean, default: false },
    oauthProvider: { type: String },
    oauthId: { type: String },
});
const User=mongoose.model('users',user);
module.exports=User;