import express from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { uploadFile } from "../s3.js";
import { unlinkFile } from "../middleware/unlinkFile.js";
const router = express.Router();

const upload = multer({
	dest: "uploads/",
});

router.post(
	"/:driverName/:journeyDate",
	upload.single("image"),
	async (req, res) => {
		const file = req.file;

		const result = await uploadFile(file);
		await unlinkFile(file.path);
		res.send(`${result.Location}`);
	},
);

export default router;
