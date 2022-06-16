import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import driverRoutes from "./routes/driverRoutes.js";
import carRoutes from "./routes/carRoutes.js";
import journeyRoutes from "./routes/journeyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import driverImageuploadRoutes from "./routes/driverImageuploadRoutes.js";
import carMaintenanceImageUploadRoute from "./routes/carMaintenanceImageUploadRoute.js";
import carFuelMaintenanceUpload from "./routes/carFuelMaintenanceUpload.js";
import carImageUploadRoutes from "./routes/carImageUploadRoutes.js";
import expenseImageUploadRoutes from "./routes/expenseImageUploadRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.options("*", cors());

app.use(express.json());

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	next();
});

app.use("/api/admin", adminRoutes);
app.use("/api/admin/drivers", driverRoutes);
app.use("/api/admin/cars", carRoutes);
app.use("/api/upload/driver", driverImageuploadRoutes);
app.use("/api/upload/car", carFuelMaintenanceUpload);
app.use("/api/upload/car/other", carMaintenanceImageUploadRoute);
app.use("/api/upload/car/profile", carImageUploadRoutes);
app.use("/api/upload/journey", expenseImageUploadRoutes);
app.use("/api/admin/journey", journeyRoutes);
app.use("/api/admin/expense", expenseRoutes);

// app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/build")));
	app.get("*", (req, res) =>
		res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html")),
	);
} else {
	app.get("/", (req, res) => {
		res.send("API is Running...!");
	});
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
	PORT,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on Port ${PORT}`,
	),
);
