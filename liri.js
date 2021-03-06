require("dotenv").config();
// axios for info
var axios = require("axios")
var Spotify = require("node-spotify-api")
var fs = require("fs");
var moment = require("moment")
var keys = require("./keys.js");
// For Spotify?
var spotify = new Spotify(keys.spotify);

var nodeCommand = process.argv;
var artist = "";
var songName = "";
var movieName = "";


// For Movie
var request = require("request")

// Do-What-It-Says
var fs = require("fs");
// recieve user input
var command = process.argv[2];
var input = process.argv[3];
console.log('command:', command, 'input:', input)


switch (command) {
    //looks up concert info
    case 'concert-this':
        concert(input)
        break;
        //Spotify
    case 'spotify-this-song':
        song();
        break;
        //Movie
    case 'movie-this':
        movie();
        break;
        // Do what is says
    case 'do-what-it-says':
        directions();
        break;
        // default
    default:
        console.log(`I'm sorry, I dont understand.`)
}
// runs song input but is pulling multiple copies of data 
function concert() {
    var song = '';
    if (input === undefined) {
        song = 'Future'
    } else {
        song = input
    }
    console.log('----------')
    console.log("Concert Info")

    // gets concert info
    request("https://rest.bandsintown.com/artists/" + song + "/events?app_id=codingbootcamp", function (error, response, body) {
        console.log(`Concert Info: ${JSON.parse(body).concertInfo}`);
    console.log(JSON.parse(body)[0])
    })
}

function song() {
    var song = '';
    if (input === undefined) {
        song = 'Everlong'
    } else {
        song = input;
    }


    spotify.search({
            type: 'track',
            query: song,
        },
        function (err, data) {
            if (err) {
                return console.log('Mistake has been made')
            };
            var songData = data
            console.log('song data from spotify search', data)
            for (i = 0; i < songData.tracks.items.length; i++) {
                console.log(`Song: ${songData.tracks.items[i].name}`);
                console.log(`Artist(s): ${songData.tracks.items[i].artists[0].name}`);
                console.log(`Album: ${songData.tracks.items[i].album.name}`);
                console.log(`Preview Link: ${songData.tracks.items[i].external_urls.spotify}`)
            }
        }
    )
}

function movie() {
    var movie = '';
    if (input === undefined) {
        console.log('Check out "The Avengers End Game" it was a great movie')
        console.log('It is on Teatv or you can purchase it')
        movie = 'The Avengers End Game'
    } else {
        movie = input;
        console.log('Here is the movie info')
    }
    // grabs movie info from 
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=cc1a03f5", function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log(`Movie Title: ${JSON.parse(body).Title}`);
            console.log(`Release Year: ${JSON.parse(body).Year}`);


            var imdb = "";
            var rotten = "";

            if (JSON.parse(body).Ratings[0]) {
                rotten = JSON.parse(body).Ratings[0].Value
            } else {
                rotten = JSON.parse(body).imdbRating
            };
            if (JSON.parse(body).Ratings[1]) {
                imdb = JSON.parse(body).Ratings[1].Value

            } else {
                imdb = 'No ratings available for this movie. '
            }
            // logs return info 
            console.log(`Rotten Tomatoes Rating: ${rotten}`);
            console.log(`IMDB Rating: ${imdb}`);
            console.log(`Conutry: ${JSON.parse(body).Country}`);
            console.log(`Language: ${JSON.parse(body).Language}`);
            console.log(`Plot: ${JSON.parse(body).Plot}`);
            console.log(`Actor(s): ${JSON.parse(body).Actors}`);
            console.log(`--------------`);

            var movieInfo = `\nUsed movie-this to find: \nTitle: ${JSON.parse(body).Title} \nYear: ${JSON.parse(body).Year} \nIMDB Rating: ${imdb} \nRotten Tomatoes Rating: ${rotten} \nCountry:${JSON.parse(body).Country} \nLanguage: ${JSON.parse(body).Language} \nPlot: ${JSON.parse(body).Plot} \nActor(s): ${JSON.parse(body).Actors} \n--------------------`
            fs.appendFile('log.txt', movieInfo, function (err) {
                if (err) throw err
            });
        } else {
            console.log(`It didn't work!`)
        }
    });
}

function directions() {
    fs.readFile('random.txt', 'utf8', function (err, data) {
        if (err) {
            console.log(error);
        } else {
            var dataArray = data.split(',');
            var dataCommand = dataArray[0];
            var dataInput = dataArray[1];
            console.log(`Let me check the data...`)
            switch (dataCommand) {
                case 'spotify-this-song':
                    input = dataInput;
                    song();
                    break;
                case 'find-movie':
                    input = dataInput;
                    movie();
                    break;
                default:
                    console.log(`It didn't work!`)

            }
        }
    })
}