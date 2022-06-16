import bcrypt from "bcryptjs";

const drivers = [
	{
		firstName: "john",
		lastName: "Doe",
		mobileNumber: "4125362",
		birthDate: "1990-01-01",
		gender: "male",
		password: bcrypt.hashSync("123456", 10),
		status: true,
	},
	{
		firstName: "john",
		lastName: "Doe",
		mobileNumber: "67125362",
		birthDate: "1990-01-01",
		gender: "male",
		password: bcrypt.hashSync("123456", 10),
		status: true,
	},
	{
		firstName: "Dwayne",
		lastName: "Johnson",
		mobileNumber: "89125362",
		birthDate: "1990-01-01",
		gender: "female",
		password: bcrypt.hashSync("123456", 10),
		status: true,
	},
];

export default drivers;
