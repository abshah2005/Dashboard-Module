import { Department } from "../models/Departments.model.js";

// Create a new department
  const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if department already exists
    const existingDepartment = await Department.findOne({ name });
    if (existingDepartment) {
      return res.status(400).json({ message: "Department already exists." });
    }

    // Create new department
    const newDepartment = await Department.create({ name });
    // const savedDepartment = await newDepartment.save();

    res.status(201).json({ message: "Department created successfully", department: newDepartment });
  } catch (error) {
    console.error("Error creating department:", error);
    res.status(500).json({ message: "Error creating department", error });
  }
};

// Get all departments
  const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error retrieving departments:", error);
    res.status(500).json({ message: "Error retrieving departments", error });
  }
};

// Get a department by ID
  const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error("Error retrieving department:", error);
    res.status(500).json({ message: "Error retrieving department", error });
  }
};

// Update a department
  const updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!updatedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department updated successfully", department: updatedDepartment });
  } catch (error) {
    console.error("Error updating department:", error);
    res.status(500).json({ message: "Error updating department", error });
  }
};

// Delete a department
  const deleteDepartment = async (req, res) => {
  try {
    const deletedDepartment = await Department.findByIdAndDelete(req.params.id);

    if (!deletedDepartment) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    console.error("Error deleting department:", error);
    res.status(500).json({ message: "Error deleting department", error });
  }
};

export {createDepartment,getDepartmentById,updateDepartment,deleteDepartment,getDepartments}