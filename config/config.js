require('dotenv').config();
const Mongo_url=process.env.MONGO_URL;
const mongoose=require("mongoose")
async function  Connectionf(){
    try{
        await mongoose.connect(Mongo_url);
        console.log("Connected to database successfully");
    }
    catch(error){
        console.log("An error occured while connecting to database!!");
        console.log(error);
    }
}
module.exports=Connectionf;