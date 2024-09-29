import mongoose, { Schema } from "mongoose";

const DepartmentsSchema=new Schema({
    name:{
        type:String,
        required:true
    }
})

export const Department=mongoose.model("Departments",DepartmentsSchema)