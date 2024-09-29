import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  permissions: {
    type: [String], 
    required: true
  }
});

// export const Roles=mongoose.model("Roles",roleSchema)
const Roles = mongoose.models.Roles || mongoose.model("Roles", roleSchema);

export { Roles };