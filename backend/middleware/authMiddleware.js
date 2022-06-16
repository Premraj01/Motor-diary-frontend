import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import Driver from "../models/driverModel.js";

const protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		try {
			token = req.headers.authorization.split(" ")[1];
			const decoded = jwt.verify(token, process.env.JWT_SECRET);

			req.admin = await Driver.findById(decoded.id).select("-password");

			next();
		} catch (error) {
			res.status(401).json({
				type: "Error",
				message: "Token Failed,Please login again",
			});
		}
	}
});

export { protect };
