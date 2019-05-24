const moment = require("moment");

const db = require("../utils/db");
const log = require("../utils/log");

exports.is_alive = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		await db.update("users", "last_seen", moment().format("YYYY-MM-DD HH:mm:ss"), "id", user_id);
		res.status(200).json({ "status": 200, "message": "ok" });

	} catch (error) {

		log(5, "matcha-server", "is_alive.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });

	}

};
