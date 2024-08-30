const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); 
const nodemailer=require('nodemailer');
const crypto = require('crypto');

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const register = async (req, res) => {
  try {
    const { email, password ,name } = req.body;

    if(!email || !password || !name)
        throw Error("All field must be filled!");

    if (!validateEmail(email)) 
        return res.status(400).json({ message: 'Invalid email format' });
      
      if (!validatePassword(password)) 
        return res.status(400).json({ message: 'Password must be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and special characters' });
      
      const exist= await User.findOne({email});
      if(exist)
        throw Error("This user already exists!!");

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const newUser = new User({ name, email, password: hashedPassword, emailVerificationToken });

    await newUser.save();

    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
  
      const verificationLink = `${process.env.BASE_URL}/auth/verify-email/${emailVerificationToken}`;
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click <a href="${verificationLink}">here</a> to verify your email address.</p>`
      });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password)
        throw Error("Email and password must be filled!");

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) 
      return res.status(401).json({ message: 'Invalid email or password!' });

    if(!user.emailVerified)
        return res.status(401).json({ message: 'Email verification is required!' });

    const token = jwt.sign({ userId: user._id ,role:user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({success:true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;
  
      const user = await User.findOne({ emailVerificationToken: token });
      if (!user)
        return res.status(400).json({ message: 'Invalid or expired verification token' });
  
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


module.exports={ register, login, verifyEmail };