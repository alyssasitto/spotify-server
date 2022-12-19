const router = require("express").Router();
const queryString = require("query-string");
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");
const request = require("request");
const stateKey = "spotify_auth_state";
const redirect_uri =
	process.env.REDIRECT_URI || "http://localhost:5005/callback/";

// Route for logging in
router.get("/login", (req, res) => {
	const generateRandomString = (length) => {
		let text = "";
		const possible =
			"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for (let i = 0; i < length; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	};

	const state = generateRandomString(16);
	const scope =
		"streaming user-read-private user-read-email user-read-playback-state user-read-currently-playing  user-modify-playback-state playlist-read-private playlist-read-collaborative user-read-recently-played user-read-currently-playing user-library-read user-top-read";

	res.cookie(stateKey, state);

	res.redirect(
		"https://accounts.spotify.com/authorize?" +
			queryString.stringify({
				response_type: "code",
				client_id: process.env.CLIENT_ID,
				scope: scope,
				redirect_uri: redirect_uri,
				show_dialog: true,
				state: state,
			})
	);
});

// Route for callback
router.get("/callback", (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	const credentials = {
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		redirectUri: redirect_uri,
	};

	const spotifyApi = new SpotifyWebApi(credentials);

	if (state === null || state !== storedState) {
		res.redirect(
			"/#" +
				queryString.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		spotifyApi
			.authorizationCodeGrant(code)
			.then((response) => {
				if (response.statusCode === 200) {
					const { access_token, refresh_token, expires_in } = response.body;
					const api_url = process.env.API_URL || "http://localhost:3000";

					res.redirect(
						`${api_url}/?` +
							queryString.stringify({
								access_token,
								refresh_token,
								expires_in,
							})
					);
				} else {
					res.redirect(
						`/?${queryString.stringify({ error: "invalid token" })}`
					);
				}
			})
			.catch((err) => {
				res.status(400).json(err);
			});
	}
});

// Route for refreshing token

router.get("/refresh_token", function (req, res) {
	const refresh_token = req.headers.refresh_token;
	const authOptions = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			Authorization:
				"Basic " +
				new Buffer(
					process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET
				).toString("base64"),
		},
		form: {
			grant_type: "refresh_token",
			refresh_token: refresh_token,
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(response);
			const access_token = body.access_token;
			res.status(200).json(access_token);
		}
	});
});

module.exports = router;
