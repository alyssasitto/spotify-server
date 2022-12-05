const router = require("express").Router();
const axios = require("axios");
const request = require("request");
const SpotifyWebApi = require("spotify-web-api-node");
const { response } = require("../app");

// Route for getting categories
router.get("/categories", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const limit = req.headers.limit;

	spotifyApi
		.getCategories({ limit: limit, country: "US" })
		.then((response) => {
			res.status(200).json(response);
			console.log(response);
		})
		.catch((err) => {
			res.status(400).json(err);
			console.log(err);
		});
});

// Route for getting a single categories details
router.get("/category_playlists", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const id = req.headers.id;

	spotifyApi
		.getPlaylistsForCategory(id)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

// Route for getting top items
router.get("/top_items", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getMyTopTracks()
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

// Route for getting playlist items
router.get("/playlist_items", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const id = req.headers.id;

	spotifyApi
		.getPlaylist(id)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// Route for getting new releases
router.get("/new_releases", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getNewReleases({ limit: 50 })
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

// Route for getting use playlists
router.get("/user_playlists", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getUserPlaylists()
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

module.exports = router;
