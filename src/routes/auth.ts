import express , { Request, Response } from "express";
import { check, validationResult } from "express-validator";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer  from "nodemailer";
import crypto from 'crypto';
import verifyToken from "../../middleware/auth";

const router = express.Router();

router.post("/login", [
    check("email", "Email is required").isEmail(),
    check("password", "password with 6 or more characters required").isLength({min: 6,}),
], async (req: Request, res:Response, ) => {

    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() })
    }

    const { email , password } = req.body

    try{
        const user = await User.findOne({ email});
        if(!user) {
            return res.status(400).json ({ message:"Invalid credentials"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){

            return res.status(400).json ({ message:"Invalid credentials"});
         }

         const token = jwt.sign({userId: user.id}, process.env.JWT_SECRET_KEY as string, {expiresIn:"1d", });

         res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000, });

            res.status(200).json({userId: user._id})

    }catch(error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong..."})

    }

});

router.get("/validate-token", verifyToken, (req: Request, res:Response) => {
    res.status(200).send({userId: req.userId})
});


router.post("/logout", (req: Request, res:Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0), 
    });
    res.send();

})


// New route for initiating password reset
router.post(
    "/forgot-password",
    [check("email", "Email is required").isEmail()],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array() });
      }
  
      const { email, password } = req.body;
  
      try {
        const user = await User.findOne({ email });
  
        if (!user) {
          return res.status(400).json({ message: "User not found" });
        }
  
        // Generate and store a secure reset token for the user
        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
        await user.save();
  
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: email,
            pass: password,
          },
        });
  
        const mailOptions = {
          from: "shefpanchal3@gmail.com",
          to: email,
          subject: "Password Reset",
          text: `Click the link to reset your password: http://localhost:5173/reset-password/${resetToken}`,
        };
  
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Password reset email sent successfully" });
      } catch (error) {
        console.error("Error initiating password reset:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  );




export default router;