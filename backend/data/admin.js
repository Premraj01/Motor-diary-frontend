import bcrypt from "bcryptjs";

const admins = [
	{
		name: "John Doe",
		mobileNumber: "837829382",
		password: bcrypt.hashSync("123456", 10),
	},
];

export default admins;
