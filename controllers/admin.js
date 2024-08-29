const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');

const validateEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
const validatePassword = (password) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

const createUser = async (req, res) => {
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
    const newUser = new User({ name, email, password: hashedPassword, emailVerificationToken ,emailVerified:true});

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports={ createUser };