require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Connectionf=require('./config/config');
const authRoutes = require('./routes/auth');
const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth',authRoutes);


try {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port: ${process.env.PORT}`);
    Connectionf();
    
  });


} catch (error) {
  console.error('Error starting the server:', error);
}