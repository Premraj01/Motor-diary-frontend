import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import Driver from "../models/driverModel.js";
import generateToken from "../utils/generateToken.js";

//@desc Auth user & get token
//@route POST /api/users/login
//@access Public

const authAdmin = asyncHandler(async (req, res) => {
	const { mobileNumber, password } = req.body;

	const admin = await Driver.findOne({ mobileNumber });

	if (admin && (await admin.matchPassword(password)) && admin.isAdmin) {
		res.json({
			_id: admin._id,
			name: admin.name,
			mobileNumber: admin.mobileNumber,
			isAdmin: admin.isAdmin,
			token: generateToken(admin._id),
		});
	} else {
		res.status(401).json({
			type: "Error",
			message: "Incorrect Mobile number or Password..!",
		});
	}
});

export { authAdmin };
