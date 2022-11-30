const router = require("express").Router();
const queryString = require("query-string");
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");

const stateKey = "spotify_auth_state";

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
				redirect_uri: process.env.REDIRECT_URI,
				show_dialog: true,
				state: state,
			})
	);
});

router.get("/callback", (req, res) => {
	const code = req.query.code || null;
	const state = req.query.state || null;
	const storedState = req.cookies ? req.cookies[stateKey] : null;

	if (state === null || state !== storedState) {
		res.redirect(
			"/#" +
				queryString.stringify({
					error: "state_mismatch",
				})
		);
	} else {
		const credentials = {
			clientId: process.env.CLIENT_ID,
			clientSecret: process.env.CLIENT_SECRET,
			redirectUri: process.env.REDIRECT_URI,
		};

		const spotifyApi = new SpotifyWebApi(credentials);

		spotifyApi
			.authorizationCodeGrant(code)
			.then((response) => {
				if (response.statusCode === 200) {
					const { access_token, refresh_token, expires_in } = response.body;

					res.redirect(
						`http://localhost:3000/?` +
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
				console.log(err);
				res.status(400).json(err);
			});
	}
});

module.exports = router;
