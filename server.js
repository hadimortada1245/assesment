require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Connectionf=require('./config/config');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const session = require('express-session');
const passport = require('passport');
const passConfig=require('./utils/passport');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', require('./routes/auth'));
app.use('/admin',adminRoutes);


try {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
    Connectionf();
    
  });


} catch (error) {
  console.error('Error starting the server:', error);
}