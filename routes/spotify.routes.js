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

// Route for getting an individual artists albums
router.get("/artist_albums", (req, res) => {
	const artistId = req.headers.id;
	const token = req.headers.token;

	axios
		.get(`https://api.spotify.com/v1/artists/${artistId}/albums?limit=50`, {
			headers: {
				"content-type": "application/x-www-form-urlencoded",
				Authorization: `Bearer ${token}`,
				"accept-encoding": "*",
			},
		})
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((err) => {
			console.log("THE ERROR ====>", err);
			res.status(400).json(err);
		});
});

// Route for getting an artists top tracks
router.get("/artist_top_tracks", (req, res) => {
	const artistId = req.headers.id;
	const token = req.headers.token;

	axios
		.get(
			`https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=US`,
			{
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${token}`,
					"accept-encoding": "*",
				},
			}
		)
		.then((response) => {
			res.status(200).json(response.data);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

// Route for playing a song
router.get("/play_song", (req, res) => {
	const token = req.headers.token;
	const context_uri = req.headers.context_uri;
	const track = req.headers.track;
	const device_id = req.headers.device_id;
	const timestamp = req.headers.timestamp;

	console.log("THIS IS THE TIMESTAMP ====>", timestamp);

	const data = {
		context_uri: `${context_uri}`,
		offset: {
			position: Number(track),
		},
		position_ms: Number(timestamp),
	};

	axios
		.put(
			`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`,
			JSON.stringify(data),
			{
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					Authorization: `Bearer ${token}`,
					"accept-encoding": "*",
				},
			}
		)
		.then((response) => {
			res.status(200).json("Song playing");
		})
		.catch((err) => {
			console.log(err);
			res.status(400).json(err);
		});
});

// Route for pausing song
router.get("/pause_song", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.pause()
		.then(() => {
			res.status(200).json("Song paused");
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

// Route for getting current song
router.get("/currently_playing", (req, res) => {
	const spotifyApi = new SpotifyWebApi({ accessToken: req.headers.token });

	spotifyApi
		.getMyCurrentPlayingTrack()
		.then((response) => {
			res.status(200).json(response);
		})
		.catch((err) => {
			res.status(400).json(err);
		});
});

module.exports = router;
