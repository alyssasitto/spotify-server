const router = require("express").Router();
const axios = require("axios");
const SpotifyWebApi = require("spotify-web-api-node");
const fetch = (...args) =>
	import("node-fetch").then(({ default: fetch }) => fetch(...args));

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

// Route for getting a single playlist
router.get("/playlist", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const id = req.headers.id;

	spotifyApi
		.getPlaylist(id)
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

	const token = req.headers.token;

	axios
		.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Authorization: `Bearer ${token}`,
				"accept-encoding": "*",
			},
		})
		.then((response) => {
			// res.status(200).json(response);
			console.log(response);
			res.status(200).json(response.data);
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

// Route for getting user playlists
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

// Route for gettings users recently played songs
router.get("/recently_played", (req, res) => {
	const token = req.headers.token;

	axios
		.get("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Authorization: `Bearer ${token}`,
				"accept-encoding": "*",
			},
		})
		.then((response) => {
			console.log(response);
			res.status(200).json(response.data);
		})
		.catch((err) => {
			console.log("THIS IS THE ERROR ===>", err);
			res.status(400).json(err);
		});
});

// Route for getting a single albums details
router.get("/album_details", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const id = req.headers.id;

	console.log("THIS IS THE ID", id);

	// res.status(200).json("hey");

	spotifyApi
		.getAlbum(`${id}`)
		.then((response) => {
			console.log(response);
			res.status(200).json(response);
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// Route for getting search results
router.get("/search", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const search = req.headers.search;

	spotifyApi
		.searchTracks(search)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

// Route for getting individual artists
router.get("/artist", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });
	const search = req.headers.search;

	spotifyApi
		.searchArtists(search)
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

module.exports = router;
