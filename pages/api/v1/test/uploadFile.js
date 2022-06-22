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

const handler = async (req, res) => {
	const timestamp = moment().format("DD-MM-YYYY");
	let type = "";
	const data = await new Promise((resolve, reject) => {
		const form = formidable({
			multiples: false,
			uploadDir: `./public/static/uploads`,
		});
		form.on("fileBegin", function (name, file) {
			if (file.mimetype.split("/")[0] === "image") {
				fs.mkdir(`./public/static/uploads/images/${timestamp}`, { recursive: true }, (err) => {});
				file.filepath = path.join(`./public/static/uploads/images/${timestamp}`, slugify(file.originalFilename));
				type = "image";
			} else {
				fs.mkdir(`./public/static/uploads/audio/${timestamp}`, { recursive: true }, (err) => {});
				file.filepath = path.join(`./public/static/uploads/audio/${timestamp}`, slugify(file.originalFilename));
				type = "audio";
			}
		});
		form.parse(req, (err, fields, files) => {
			if (err) reject({ msg: err });
			resolve({ err, fields, files });
		});
	});

	res.json({ data: data, filepath: data.files[`${type}`].filepath.replace("public\\", "") });
};
export default handler;
