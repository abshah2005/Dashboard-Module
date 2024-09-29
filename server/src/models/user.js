import mongoose, { Schema } from "mongoose";
const UserSchema = new Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    EmployeeId:{type:Schema.Types.ObjectId, ref:"Employees",required: true},
    RoleId:{type:Schema.Types.ObjectId, ref:"Roles",required: true},
    DepartmentId:{type:Schema.Types.ObjectId, ref:"Departments",required: true},
    otp: { type: String },
    otpExpiry: { type: Date },
    resetToken: { type: String },
    resetTokenExpiry: { type: Date },
  },
  { timestamps: true }
  );
  
  export const User = mongoose.model("Users", UserSchema);
  
  // role: { type: Schema.Types.ObjectId, ref: "Roles", required: true }