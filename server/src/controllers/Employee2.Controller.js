import { Department } from "../models/Departments.model.js";
import { Employee } from "../models/Employee.model.js";
import bcrypt from "bcrypt";
import { User } from "../models/user.js";
import { Roles } from "../models/roles.model.js";
import { uploadonCloudinary } from "../utils/Fileupload.js";

const addEmployeeAndUser = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      roleId,
      DepartmentId,
      EmployeeId,
      status,
      MobileNumber,
      PersonalEmail,
      DateofBirth,
      MaritalStatus,
      Nationality,
      Gender,
      Address,
      City,
      State,
      ZipCode,
      EmployeeType,
      ProfessionalEmail,
      Designation,
      joiningDate,
      professionalUsername,
      Username,
      Password,
      Email,
    } = req.body;

    const files = req.files;
    if (!files) {
      return res.status(400).json({ message: "No files were uploaded." });
    }

    const appointmentLetter = files.AppointmentLetter
      ? files.AppointmentLetter[0]
      : null;
    const salarySlip = files.SalarySlip ? files.SalarySlip[0] : null;
    const relievingLetter = files.RelievingLetter
      ? files.RelievingLetter[0]
      : null;
    const experienceLetter = files.ExperienceLetter
      ? files.ExperienceLetter[0]
      : null;

    const appointmentLetterUrl = appointmentLetter
      ? await uploadonCloudinary(appointmentLetter.path)
      : null;
    const salarySlipUrl = salarySlip
      ? await uploadonCloudinary(salarySlip.path)
      : null;
    const relievingLetterUrl = relievingLetter
      ? await uploadonCloudinary(relievingLetter.path)
      : null;
    const experienceLetterUrl = experienceLetter
      ? await uploadonCloudinary(experienceLetter.path)
      : null;

    const role = await Roles.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const department = await Department.findById(DepartmentId);
    if (!department) {
      return res.status(400).json({ message: "Invalid department specified." });
    }

    const newEmployee = await Employee.create({
      firstname,
      lastname,
      role: role._id,
      EmployeeId,
      Department: department._id,
      MobileNumber,
      PersonalEmail,
      DateofBirth,
      MaritalStatus,
      Nationality,
      status,
      Gender,
      Address,
      City,
      State,
      ZipCode,
      EmployeeType,
      ProfessionalEmail,
      Designation,
      joiningDate,
      AppointmentLetter: appointmentLetterUrl?.url || "not uploaded yet",
      SalarySlip: salarySlipUrl?.url || "not uploaded yet",
      RelievingLetter: relievingLetterUrl?.url || "not uploaded yet",
      ExperienceLetter: experienceLetterUrl?.url || "not uploaded yet",
      professionalUsername,
      Username,
      Password: await bcrypt.hash(Password, 10),
      Email,
    });

    if (!newEmployee) {
      return res
        .status(400)
        .json({ message: "Something went wrong while creating Employee" });
    }

    const newUser = await User.create({
      fullname: `${firstname} ${lastname}`,
      email: newEmployee.Email,
      password: newEmployee.Password,
      EmployeeId: newEmployee._id,
      RoleId:newEmployee.role,
      DepartmentId:newEmployee.Department
    });

    res.status(201).json({
      message: "Employee and User created successfully",
      employee: newEmployee,
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating employee and user:", error);
    res
      .status(500)
      .json({ message: "Error creating employee and user", error });
  }
};



const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate("Department")
      .populate("role");

    if (!employees.length) {
      return res.status(404).json({ message: "No employees found." });
    }

    res
      .status(200)
      .json({ message: "Employees retrieved successfully.", employees });
  } catch (error) {
    console.error("Error retrieving employees:", error);
    res.status(500).json({ message: "Error retrieving employees", error });
  }
};

const removeEmployee = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const user = await User.findOne({ EmployeeId: employeeId });
    if (user) {
      await User.findByIdAndDelete(user._id);
    }

    await Employee.findByIdAndDelete(employeeId);

    res
      .status(200)
      .json({ message: "Employee and associated user deleted successfully." });
  } catch (error) {
    console.error("Error removing employee:", error);
    res.status(500).json({ message: "Error removing employee", error });
  }
};


const updateEmployee = async (req, res) => {
  try {
    const {
      employeeId, //mongodb wali id
      firstname,
      lastname,
      roleId,
      DepartmentId,
      EmployeeId, //self assigned id
      MobileNumber,
      PersonalEmail,
      DateofBirth,
      status,
      MaritalStatus,
      Nationality,
      Gender,
      Address,
      City,
      State,
      ZipCode,
      EmployeeType,
      ProfessionalEmail,
      Designation,
      joiningDate,
      professionalUsername,
      Username,
      Password,
    } = req.body;
    const files = req.files;

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;
    if (roleId) {
      const role = await Roles.findById(roleId);
      if (!role) {
        return res.status(400).json({ message: "Invalid role specified." });
      }
      employee.role = role._id;
    }

    if (DepartmentId) {
      const department = await Department.findById(DepartmentId);
      if (!department) {
        return res.status(400).json({ message: "Invalid department specified." });
      }
      employee.Department = department._id;
    }

    employee.EmployeeId = EmployeeId || employee.EmployeeId;
    employee.MobileNumber = MobileNumber || employee.MobileNumber;
    employee.PersonalEmail = PersonalEmail || employee.PersonalEmail;
    employee.DateofBirth = DateofBirth || employee.DateofBirth;
    employee.MaritalStatus = MaritalStatus || employee.MaritalStatus;
    employee.Nationality = Nationality || employee.Nationality;
    employee.Gender = Gender || employee.Gender;
    employee.Address = Address || employee.Address;
    employee.City = City || employee.City;
    employee.State = State || employee.State;
    employee.ZipCode = ZipCode || employee.ZipCode;
    employee.EmployeeType = EmployeeType || employee.EmployeeType;
    employee.ProfessionalEmail = ProfessionalEmail || employee.ProfessionalEmail;
    employee.Designation = Designation || employee.Designation;
    employee.joiningDate = joiningDate || employee.joiningDate;
    employee.professionalUsername = professionalUsername || employee.professionalUsername;
    employee.Username = Username || employee.Username;
    employee.status=status||employee.status
    if (files) {
      const appointmentLetter = files.AppointmentLetter ? files.AppointmentLetter[0] : null;
      const salarySlip = files.SalarySlip ? files.SalarySlip[0] : null;
      const relievingLetter = files.RelievingLetter ? files.RelievingLetter[0] : null;
      const experienceLetter = files.ExperienceLetter ? files.ExperienceLetter[0] : null;

      if (appointmentLetter) {
        const appointmentLetterUrl = await uploadonCloudinary(appointmentLetter.path);
        employee.AppointmentLetter = appointmentLetterUrl?.url || employee.AppointmentLetter;
      }
      if (salarySlip) {
        const salarySlipUrl = await uploadonCloudinary(salarySlip.path);
        employee.SalarySlip = salarySlipUrl?.url || employee.SalarySlip;
      }
      if (relievingLetter) {
        const relievingLetterUrl = await uploadonCloudinary(relievingLetter.path);
        employee.RelievingLetter = relievingLetterUrl?.url || employee.RelievingLetter;
      }
      if (experienceLetter) {
        const experienceLetterUrl = await uploadonCloudinary(experienceLetter.path);
        employee.ExperienceLetter = experienceLetterUrl?.url || employee.ExperienceLetter;
      }
    }

    const updatedEmployee = await employee.save();

    const user = await User.findOne({ EmployeeId: employeeId });
    if (user) {
      user.fullname = `${firstname || employee.firstname} ${lastname || employee.lastname}`;
      user.email = ProfessionalEmail || user.email;
      if (Password) {
        user.password = await bcrypt.hash(Password, 10);
      }
      if(roleId){
        user.RoleId=roleId
      }
      if(DepartmentId){
        user.DepartmentId=DepartmentId
      }
      await user.save();
    }

    res.status(200).json({
      message: "Employee and User updated successfully",
      employee: updatedEmployee,
      user,
    });
  } catch (error) {
    console.error("Error updating employee and user:", error);
    res.status(500).json({ message: "Error updating employee and user", error });
  }
};



const getEmployeeById = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required." });
    }

    const employee = await Employee.findById(employeeId).populate([
      "Department",
      "role",
    ]);


    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    res
      .status(200)
      .json({ message: "Employee retrieved successfully.", employee });
  } catch (error) {
    console.error("Error retrieving employee:", error);
    res.status(500).json({ message: "Error retrieving employee", error });
  }
};

export {
  addEmployeeAndUser,
  removeEmployee,
  updateEmployee,
  getAllEmployees,
  getEmployeeById,
};

