import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    resetToken?: string; // Add this line
  resetTokenExpiration?: number; // Add this line
};

const userSchema = new mongoose.Schema({
   email : { type : String, required: true , unique: true},
   password: { type: String, required: true },
   firstName: { type: String, required: true },
   lastName: { type: String, required: true },

   resetToken: { type: String }, // Add this line
   resetTokenExpiration: { type: Number }, // Add this line
})

userSchema.pre("save", async function (next) {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();

});

const User = mongoose.model<UserType>("User" , userSchema);

export default User;