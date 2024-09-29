import mongoose, { Schema } from "mongoose";

const EmployeeSchema = new Schema(
    {
      firstname:{
        type: String,
        required: true,
      },
      lastname:{
        type: String,
        required: true,
      },
      role: { type: Schema.Types.ObjectId, ref: "Roles", required: true },
      EmployeeId: {
        type: String,
        required: true,
        unique:true
      },
      Department: {
        type: Schema.Types.ObjectId,
        ref: "Departments",
        required: true,
      },
      MobileNumber: {
        type: String,
        required: true,
      },
      PersonalEmail: {
        type: String,
        required: true,
      },
      DateofBirth: {
        type: Date,
        required: true,
      },
      MaritalStatus: {
        type: String,
        enum: ["Single", "Married"],
        default: "Single",
        required: true,
      },
      Nationality: {
        type: String,
        required: true,
      },
      Gender: {
        type: String,
        enum: ["Male", "Female", "Other"], 
        default: "Male", 
        required: true,
      },
      Address: {
        type: String,
        required: true,
      },
      City: {
        type: String,
        required: true,
      },
      State: {
        type: String,
        required: true,
      },
      ZipCode: {
        type: String,
        required: true,
      },
      EmployeeType: {
        type: String,
        enum:["Office","Remote"],
        default:"Office",
        required: true,
      },
      ProfessionalEmail: {
        type: String,
        required: true,
      },
      Designation: {
        type: String,
        required: true,
      },
      joiningDate: {
        type: Date,
        required: true,
      },
      AppointmentLetter: {
        type: String,
      },
      SalarySlip: {
        type: String,
      },
      RelievingLetter: { 
        type: String,
      },
      ExperienceLetter: {
        type: String,
      },
      status:{
        type: String,
        enum:["Permanent","Relayoff","Contract","Left","Onleave","Terminate","Retired"],
        default:"Employee",
        required: true,
      },
      professionalUsername: {
        type: String,
        required: true,
      },
      Username: { //this will be used for signing in
        type: String,
        required: true,
      },
      Password: {//this will be used for signing in
        type: String,
        required: true,
      },
      Email:{//this will be used for signing in
        type: String,
        required: true,
        unique:true
      }
    },
    { timestamps: true }
  );
  
  export const Employee = mongoose.model("Employees", EmployeeSchema);
  