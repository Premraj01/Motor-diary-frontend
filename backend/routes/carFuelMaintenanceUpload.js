import express from "express";
import path from "path";
import multer from "multer";
import { unlinkFile } from "../middleware/unlinkFile.js";

import { uploadFile } from "../s3.js";
const router = express.Router();

const upload = multer({
	dest: "uploads/",
});

router.post("/:id", upload.single("image"), async (req, res) => {
	const file = req.file;

	const result = await uploadFile(file);
	await unlinkFile(file.path);
	res.send(`${result.Location}`);
});

export default router;
