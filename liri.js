var keys = require("./keys.js");

// Global Variables
	var command = process.argv[2];
	var searchTerm = process.argv[3];
	for (var i = 4; i < process.argv.length; i++) {
		searchTerm += " " + process.argv[i];
	}

// Functions
	function commandList() {
		if (command === "my-tweets") {
			// my-tweets
			showTweets();
			
		} else if (command === "spotify-this-song") {
			// spotify-this-song
			showSong();
			
		} else if (command === "movie-this") {
			// movie-this
			showMovie();

		} else {
			console.log('----------');
			console.log("That is not a command I am familiar with. Please use these commands:");

			var fs = require("fs");

			fs.readFile("commands.txt", "utf8", function(error, data) {
			  if (error) {
			    return console.log(error);
			  }
			  var dataArr = data.split(",");

			  for (var i = 0; i < dataArr.length; i++) {
			  	console.log("-", dataArr[i].trim());
			  }
			});

		}
	}

	function showTweets() {
		var Twitter = require('twitter');
		 
		var client = new Twitter({
		  consumer_key: keys.twitterKeys.consumer_key,
		  consumer_secret: keys.twitterKeys.consumer_secret,
		  access_token_key: keys.twitterKeys.access_token_key,
		  access_token_secret: keys.twitterKeys.access_token_secret
		});
		 
		var params = {screen_name: 'hapa_tap'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		  if (!error) {
		  	for (var i = 0; i < 20; i++) {
		  		if (tweets[i] === undefined) {
		  			return console.log("End of tweets")
		  		}
		  		console.log('----------');
		  		console.log("Tweet:", tweets[i].text);
		  		console.log('Created:', tweets[i].created_at);
		  		console.log('----------');
		  	}
		  }
		});
	}

	function showSong() {
		var Spotify = require('node-spotify-api');
		 
		var spotify = new Spotify({
		  id: keys.spotifyKeys.id,
		  secret: keys.spotifyKeys.secret
		});

		spotify.search({ type: 'track', query: searchTerm }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }
		 	var songInfo = data.tracks.items;

			for (var i = 0; i < 20; i++) {
				console.log('----------');
				console.log('Artist:', songInfo[i].artists[0].name);
				console.log('Song:', songInfo[i].name);
				console.log('Spotify link:', songInfo[i].href);
				console.log('Album:', songInfo[i].album.name);
				console.log('----------');
			}
		});
	}

	function showMovie() {
		var movie = "Mr. Nobody";
		if (searchTerm) {
			movie = searchTerm;
		}
		var request = require('request');

		request('http://www.omdbapi.com/?apikey=' + keys.omdbKey.api + '&t=' + encodeURIComponent(movie), function (error, response, body) {
		  if (error) {
			  console.log('error:', error);
			  console.log('statusCode:', response && response.statusCode);
			  return;
		  }
		  var movie = JSON.parse(body);
		  if (movie.Title === undefined) {
		  	return console.log("Sorry, I couldn't find the movie.");
		  }

		  console.log('----------');
		  console.log('Title:', movie.Title);
		  console.log('Year:', movie.Year);
		  console.log('IMDB Rating:', movie.Ratings[0].Value);
		  console.log('Rotten Tomatoes Rating:', movie.Ratings[1].Value);
		  console.log('Country:', movie.Country);
		  console.log('Language:', movie.Language);
		  console.log('Plot:', movie.Plot);
		  console.log('Actors:', movie.Actors);
		});
	}

// If Statements
	if (command === "do-what-it-says") {
		// do-what-it-says
		var fs = require("fs");

		fs.readFile("random.txt", "utf8", function(error, data) {
		  if (error) {
		    return console.log(error);
		  }
		  var dataArr = data.split(",");

		  command = dataArr[0].trim();
		  searchTerm = dataArr[1].trim();
		  commandList();
		});

	} else {
		commandList();
	}
