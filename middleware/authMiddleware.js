import JWT from "jsonwebtoken"; 

import userModel from "../models/userModel.js";

  export const isLogin = async (req, res, next) => {
    try {
      
      const token = req.headers.authorization.slice(7);
      
      if (!token) {
        return res.send({ message: "Unauthorized" });
      }

        const decode = JWT.verify(  
          token,
          process.env.JWT_SECRET
        );

      req.user = decode;  
      next();
    } catch (error) {
      return res.send({ message: "Unauthorized" });
    }
  };

//admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {  
      return res.status(401).send({ 
        success: false,
        message: "UnAuthorized Access U r not the AdminDharma...!",
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).send({
      success: false,
      message: error.message,
      error,
    });
  }
};
