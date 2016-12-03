//initialize npm
var fs = require("fs");

var request = require("request");

var twitter = require("twitter");
   var keys = require("./keys.js");

var spotify = require("spotify");



//Importing Twitter Keys from keys.js
// var keysList = keys.twitterKeys;
// console.log(keysList);
// console.log(keysList.consumer_key);


//store all node inputs into an array
var nodeArgs = process.argv;

if ( (nodeArgs[2] !== 'my-tweets') && (nodeArgs[2] !== 'spotify-this-song') && (nodeArgs[2] !== 'movie-this') &&
(nodeArgs[2] !== 'do-what-it-says') ) {
   console.log('invalid command');
   return;
}
//dummy variable to hold movie title
var movieName = '';
var songName = '';

//handle cases where the movie title coule be longer than 1 word
if (process.argv[2] == 'movie-this') {

   for (var i = 3; i < nodeArgs.length; i++) {

     if (i > 3 && i < nodeArgs.length) {

       movieName = movieName + "+" + nodeArgs[i];

     }

     else {

       movieName += nodeArgs[i];

     }
   }

   //Handles cases of no input
   if (movieName == '') {

      movieName = 'Mr. Nobody';

   }

   // console.log(movieName);

   ////////////
   //AJAX//////
   ////////////

   // url for querying omdb data with user-inputted title of movie
   var queryUrl = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&r=json&tomatoes=true';

   //check if correct
   // console.log('URL: ' + queryUrl);

   //npm function
   request(queryUrl, function(error, response, body) {

      //if no problems exist,
      if (!error && response.statusCode === 200) {
         console.log("Title: " + JSON.parse(body).Title);
         console.log("Released: " + JSON.parse(body).Year);
         console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
         console.log("Country: " + JSON.parse(body).Country);
         console.log("Language: " + JSON.parse(body).Language);
         console.log("Plot: " + JSON.parse(body).Plot);
         console.log("Actors: " + JSON.parse(body).Actors);
         console.log("RT Rating: " + JSON.parse(body).tomatoRating);
         console.log("RT URL: " + JSON.parse(body).tomatoURL);
      }


   });
}

//initializing authorization
var client = new twitter({
   consumer_key: keys.twitterKeys.consumer_key,
   consumer_secret: keys.twitterKeys.consumer_secret,
   access_token_key: keys.twitterKeys.access_token_key,
   access_token_secret: keys.twitterKeys.access_token_secret
});


//setting parameters
var params = {
   user_id: '804915948922646528',
   count: '20'

};

//if user specifies twit function in input...
if (process.argv[2] == 'my-tweets') {

   //npm call function
   client.get('statuses/user_timeline', params, function(error, tweets, response, body) {

      if (!error) {
         //loops through tweets to iterate through the first 20 entries

         for (var j = 0; j < tweets.length; j++) {
            console.log('Tweet #'+parseInt(j+1) +'----------------');
            console.log(tweets[j].text);
            console.log('Posted at: '+ tweets[j].created_at);
            console.log('');
         }

      }

   });

};



if (process.argv[2] == 'spotify-this-song') {



      for (var k = 3; k < nodeArgs.length; k++) {

        if (k > 3 && k < nodeArgs.length) {
          songName = songName + "+" + nodeArgs[k];

        } else {
          songName += nodeArgs[k];
        }

     };

      //Handles cases of no input
      if (songName == '') {
         songName = 'The Sign';
      };
   spotify.search({
      type: 'track',
      limit: 5,
      query: songName

   }, function (err, data) {
         if (!err) {
            // console.log(songName);
            console.log('Track: '+data.tracks.items[0].name);
            console.log('Artist: '+data.tracks.items[0].artists[0].name);
            console.log('Album: '+data.tracks.items[0].album.name);
            console.log('Preview URL: '+data.tracks.items[0].preview_url);
         }
      });
}

if (process.argv[2] == 'do-what-it-says') {

   fs.readFile("random.txt", "utf8", function(error, data) {

      // console.log(data);

      var dataArr = data.split(",");
      // console.log(dataArr);

      songName = dataArr[1];
      process.argv[2] == dataArr[0];

      spotify.search({
         type: 'track',
         limit: 5,
         query: songName

      }, function (err, data) {
            if (!err) {
               // console.log(songName);
               console.log('Track: '+data.tracks.items[0].name);
               console.log('Artist: '+data.tracks.items[0].artists[0].name);
               console.log('Album: '+data.tracks.items[0].album.name);
               console.log('Preview URL: '+data.tracks.items[0].preview_url);
            }
         });



   });


}
