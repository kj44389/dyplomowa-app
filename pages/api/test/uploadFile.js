import sql_query from "lib/db";
import fs from "fs";
import formidable from "formidable";
import moment from "moment";
import slugify from "slugify";
import path from "path";

export const config = {
	api: {
		bodyParser: false,
	},
};

export default async (req, res) => {
	const timestamp = moment().format("DD-MM-YYYY");
	// console.log(req);
	let type = "";

	const data = await new Promise((resolve, reject) => {
		const form = formidable({
			multiples: false,
			uploadDir: `./public/static/uploads`,
		});
		form.on("fileBegin", function (name, file) {
			console.log(file.mimetype);
			if (file.mimetype.split("/")[0] === "image") {
				fs.mkdir(`./public/static/uploads/images/${timestamp}`, { recursive: true }, (err) => {
					return console.log("error", err);
				});
				file.filepath = path.join(`./public/static/uploads/images/${timestamp}`, slugify(file.originalFilename));
				type = "image";
			} else {
				fs.mkdir(`./public/static/uploads/audio/${timestamp}`, { recursive: true }, (err) => {
					return console.log("error", err);
				});
				file.filepath = path.join(`./public/static/uploads/audio/${timestamp}`, slugify(file.originalFilename));
				type = "audio";
			}
		});
		form.parse(req, (err, fields, files) => {
			if (err) reject({ msg: err });
			resolve({ err, fields, files });
		});
	});

	console.log(data.files, type);
	res.json({ data: data, filepath: data.files[`${type}`].filepath.replace("public\\", "") });
};
