import { Employee } from "../models/Employee.model.js";
import { User } from "../models/user.js";


const getAllUsers = async (req, res) => {
    try {
      const users = await User.find().populate(["EmployeeId","RoleId","DepartmentId"]);
      if (!users || users.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }
      res.status(200).json({ message: "Users fetched successfully", data: users });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving users", error: error.message });
    }
  };
  
  const getUserById = async (req, res) => {
    const { id } = req.params;
    
    try {
      const user = await User.findById(id).populate(["EmployeeId","RoleId","DepartmentId"]);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User fetched successfully", data: user });
    } catch (error) {
      res.status(500).json({ message: "Error retrieving user", error: error.message });
    }
  };


  const updateUser = async (req, res) => {
    const { id } = req.params;
    const { fullname, email, password, RoleId, DepartmentId } = req.body;
  
    try {
      // Find the user by ID
      let user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      let employee = await Employee.findById(user.EmployeeId);
      if (!employee) {
        return res.status(404).json({ message: "Related employee not found" });
      }
  
      // Update fields in the User model
      if (fullname) user.fullname = fullname;
      if (email) user.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }
      if (RoleId) user.RoleId = RoleId;
      if (DepartmentId) user.DepartmentId = DepartmentId;
  
      // Save the updated user
      await user.save();
  
      // Update fields in the related Employee model
      if (fullname) {
        const [firstname, lastname] = fullname.split(" ");
        employee.firstname = firstname || employee.firstname;
        employee.lastname = lastname || employee.lastname;
      }
      if (email) employee.ProfessionalEmail = email;
      if (RoleId) employee.role = RoleId;
      if (DepartmentId) employee.Department = DepartmentId;
  
      await employee.save();
  
      res.status(200).json({
        message: "User and related Employee updated successfully",
        data: { user, employee },
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating user and related employee",
        error: error.message,
      });
    }
  };
  
  
  // DELETE - Delete a user
  const deleteUser = async (req, res) => {
    const { id } = req.params;
  
    try {
      const user = await User.findByIdAndDelete(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user", error: error.message });
    }
  };

export{getAllUsers,getUserById,updateUser,deleteUser}