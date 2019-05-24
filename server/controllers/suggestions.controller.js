const db = require("../utils/db");
const suggestion = require("../utils/suggestion");
const validate = require("../utils/validate");
const log = require("../utils/log");

exports.root = async (req, res) => {

	let user_id = req.session.user_id;

	if (!user_id) {
		res.status(400).json({ "status": 400, "message": "missing parameters" });
		return ;
	}

	try {

		/* get user preferences from id */
	
		const [user_data] = await db.select(null, "users", ["id"], [user_id]);

		if (!validate.gender(user_data.gender) || !validate.sexual_orientation(user_data.sexual_orientation) ||
			!validate.date_of_birth(user_data.date_of_birth) || !user_data.latitude || !user_data.longitude) {
			res.status(400).json({ "status": 400, "message": "more profile details are needed" });
			return ;
		}

		/* query all users according to gender & sexual_orientation */

		let cols = ["sexual_orientation"];
		let vals = [user_data.sexual_orientation];
		let rets = ["id", "firstname", "lastname", "popularity_score",
					"username", "latitude", "longitude", "date_of_birth"];

		if (user_data.sexual_orientation !== "bisexual") {
			let [prefs] = suggestion.preferences(user_data.gender, user_data.sexual_orientation);
			cols = ["gender"].concat(cols);
			vals = [prefs].concat(vals);
		}

		var suggestions = await db.select(rets, "users", cols, vals);
		var blocked = await db.select(["target_id"], "blocks", ["user_id"], [user_id]);
		suggestions = suggestions.filter((s) => s.id != user_id).filter((s) => !blocked.some(b => b.target_id === s.id));

		/* sort them according to interests, location, age & popularity_score */

		const interests = await db.select(null, "interests", [], []);
		const images = await db.select(["user_id", "image"], "images", [], []);
		const likes = await db.select(null, "likes", [], []);

		for (let i = 0; i < suggestions.length; i++) {
			suggestions[i].interests = interests.filter((o) => o.user_id === suggestions[i].id).map((o) => o.interest);
			suggestions[i].images = images.filter((o) => o.user_id === suggestions[i].id);
			suggestions[i].compatibility = suggestion.compatibility(suggestions[i], user_data, interests);
			let is_liked = likes.filter((o) => o.user_id === user_id && o.target_id === suggestions[i].id);
			suggestions[i].is_liked = is_liked.length ? true : false;
		};

		suggestions.sort((a, b) => a.compatibility - b.compatibility).reverse();
		res.status(200).json({ "status": 200, "message": "ok", suggestions });

	} catch (error) {

		log(5, "matcha-server", "suggestions.controller.js", error.message);
		res.status(500).json({ "status": 500, "message": "internal server error" });
	
	}

};
