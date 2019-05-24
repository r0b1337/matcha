const db = require("./db");
const log = require("./log");

/*
** -------------------------------------------------------------------------- **
**	Send a notification to `user_id` containing `details`.
** -------------------------------------------------------------------------- **
*/

exports.send = async (user_id, details) => {
	try {
		let data = await db.insert("notifications", ["user_id", "details"], [user_id, details]);
		return data;
	} catch (error) {
		log(5, "matcha-server", "notifications.js", error.message);
		return null;
	}
};
