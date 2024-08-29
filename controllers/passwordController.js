const User=require('../models/user');
const nodemailer=require('nodemailer');
const crypto=require('crypto');
const bcrypt=require('bcryptjs')
const requestPasswordReset=async(req,res) =>{
    const {email} =req.body;
    try{
        const user=await User.findOne({email});

        if (!user) 
            return res.status(400).json({ message: 'User not found' });
        
        const otp = crypto.randomBytes(3).toString('hex'); 
        user.resetToken = otp;
        user.resetTokenExpiry = Date.now() + 3600000; 
        await user.save();
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Your OTP code is ${otp}`,
          });
    

        res.json({ message: 'OTP sent to your email' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing request', error: error.message });
    }
}
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await User.findOne({
            email,
            resetToken: otp,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
};
module.exports={requestPasswordReset,resetPassword};