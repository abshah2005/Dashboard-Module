import { Roles } from "../models/roles.model.js";

 const createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const existingRole = await Roles.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists." });
    }

    const newRole = await Roles.create({ name, permissions });

    res
      .status(201)
      .json({ message: "Role created successfully", role: newRole });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({ message: "Error creating role", error });
  }
};

 const getRoles = async (req, res) => {
  try {
    const roles = await Roles.find();
    res.status(200).json(roles);
  } catch (error) {
    console.error("Error retrieving roles:", error);
    res.status(500).json({ message: "Error retrieving roles", error });
  }
};

 const getRoleById = async (req, res) => {
  try {
    const role = await Roles.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: "Role not found" });
    }
    res.status(200).json(role);
  } catch (error) {
    console.error("Error retrieving role:", error);
    res.status(500).json({ message: "Error retrieving role", error });
  }
};


 const updateRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    const updatedRole = await Roles.findByIdAndUpdate(
      req.params.id,
      { name, permissions },
      { new: true }
    );

    if (!updatedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res
      .status(200)
      .json({ message: "Role updated successfully", role: updatedRole });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ message: "Error updating role", error });
  }
};

 const deleteRole = async (req, res) => {
  try {
    const deletedRole = await Roles.findByIdAndDelete(req.params.id);

    if (!deletedRole) {
      return res.status(404).json({ message: "Role not found" });
    }

    res.status(200).json({ message: "Role deleted successfully" });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({ message: "Error deleting role", error });
  }
};

export  { createRole, getRoleById, getRoles, deleteRole,updateRole };
