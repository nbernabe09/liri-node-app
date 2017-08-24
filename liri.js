var keys = require("./keys.js");

if (process.argv[2] === "my-tweets") {
	// my-tweets
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
	
} else if (process.argv[2] === "spotify-this-song") {
	// spotify-this-song
	var Spotify = require('node-spotify-api');
	 
	var spotify = new Spotify({
	  id: keys.spotifyKeys.id,
	  secret: keys.spotifyKeys.secret
	});

	var song = process.argv[3];
	for (var i = 4; i < process.argv.length; i++) {
		song += " " + process.argv[i];
	}
	 
	spotify.search({ type: 'track', query: song }, function(err, data) {
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
	
} else if (process.argv[2] === "movie-this") {
	// movie-this
	var movie = "Mr. Nobody";

	if (process.argv[3]) {
		movie = process.argv[3];
		for (var i = 4; i < process.argv.length; i++) {
			movie += " " + process.argv[i];
		}
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
	
} else if (process.argv[2] === "do-what-it-says") {
	// do-what-it-says
	console.log("What the heck am I doing?");
	
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
