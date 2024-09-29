import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import RolesRoutes from "./routes/Roles.Route.js"
import DepartmentRoutes from "./routes/Departments.Route.js" 
import EmployeeRoutes from "./routes/Employee.Route.js"
import UserRoutes from "./routes/User.Routes.js" 
import connectDB from "./config/db.js";
dotenv.config();

const app = express();
connectDB()
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use("/api/auth", authRoutes);
app.use("/api/Roles",RolesRoutes);
app.use("/api/Departments",DepartmentRoutes)
app.use("/api/Employees",EmployeeRoutes)
app.use("/api/Users",UserRoutes)

const port=process.env.PORT;
app.listen(port, () => {
    console.log(`Server Started at port ${port}`);
  });

export { app };
