const jwt=require('jsonwebtoken');
const User=require('../models/user');
const authenticatUser=(role)=>{
    return async(req,res,next)=>{
        if (
            !req.headers.authorization ||
            !req.headers.authorization.startsWith('Bearer')
          )
            return res.status(400).json({
              message: 'No auth credentials',
            });
        const {authorization} =req.headers;
        const token=authorization.split(' ')[1];
        if(!token)return res.status(400).json({message:"No token detected"});
        try{
            const credentials=jwt.verify(token,process.env.JWT_SECRET);
            
            if(credentials.role!==role)throw Error("You are not authorized");
            const exist=await User.findById({_id:credentials.userId});
            if(!exist)throw Error("User not found !!");
            next();
        }catch(error){
            res.status(500).json({message:"An error occured",error:error.message})
        }
    }
}
module.exports={authenticatUser};