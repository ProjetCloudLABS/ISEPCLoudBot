const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
var getreq = require('request')
var translate = require('@google-cloud/translate')({
  key: 'AIzaSyA8VsE9eKIxKXSHPJq0x9sI4rYinB48UWE'
})
var sendChannelTwitter = null

var TwitterPackage = require('twitter') // get twitter library
var secret = {// sets my twitter app information
  consumer_key: '7v9mpULXoh9mDDIzO2oi7RTB8',
  consumer_secret: 'eqcUnEdb6gqLMExzBbOm8tORbs9PXsmi43ZO0KM4kXISMTfLFN',
  access_token_key: '865466541730447360-HzRxxXsrnvjRdkKqaYIJBVyWWNqnDnl',
  access_token_secret: 'kMvgAOn1SFhJroZ3nCznyaxenYid24oVBZHmDji76PtWm'
}
var Twitter = new TwitterPackage(secret)

function getWeatherStatus (id) {
  var result = ''
  // il y a ....
  switch (id) {
    case 200 || 201 || 202 || 210:
      result = 'un orage avec de la pluie'
      break
    case (id < 233 && id >= 211) || 901 || 902 || 965 || 961 || 960:
      result = 'un orage'
      break
    case id < 532 && id >= 300:
      result = 'de la pluie'
      break
    case id < 613 && id >= 600:
      result = 'de la neige'
      break
    case id < 623 && id >= 615:
      result = 'de la neige et de la pluie'
      break
    case (id < 712 && id >= 701) || 741:
      result = 'du brouillard ou de la fumee'
      break
    case 721 || 751 || 731 || 762 || 751 || 761:
      result = 'de la poussiere ou du sable'
      break
    case 781 || 900 || 962 :
      result = 'une tornade'
      break
    case 800 :
      result = 'un ciel degage'
      break
    case id < 805 && id >= 801 :
      result = 'des nuages'
      break
    case 903 :
      result = 'du froid'
      break
    case 904 :
      result = 'du chaud'
      break
    case 905 || (id >= 952 && id < 959):
      result = 'du vent'
      break
    default:
      result = 'du vent'
  }
  return result
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.sendMessage('Why, hello you too ! :)')
  } else if (msg.content === 'goodbye') {
    msg.channel.sendMessage('Well, have a nice day !')
  } else if (msg.content.startsWith('!twitter')) {
    if (msg.content.startsWith('!twitterPost')) {
      msg.channel.sendMessage('Whaar Sending arggg')
      var messageContent = msg.content.substr(13, msg.content.length)
      msg.channel.sendMessage(messageContent.substr(0, 138)) // limit the message to 140 chars
      // sends the tweet :
      Twitter.post('statuses/update', {status: messageContent.substr(0, 138)}, // limit the message to 140 chars
        function (error, tweet, response) {
          if (error) {
            console.log(error)
          }
        }
      )
      // end of tweet
      msg.channel.sendMessage('Wharrrg Sent arrrg')
    }
    if (msg.content === '!twitterHear') {
      sendChannelTwitter = msg.channel
      msg.channel.sendMessage('Whaar This channel will hear twitter new messages containing @bot_test_labs')
    }
    if (msg.content === '!twitterHelp') {
      msg.channel.sendMessage('I am \'bot_test_labs\' on Twitter ')
      msg.channel.sendMessage('Whaaar  use \'!twitterPost Yourmessage\' to send a tweet')
      msg.channel.sendMessage('write once \'!twitterHear\' so that This bot will notify you when someone uses @bot_test_labs ')
    }
  } else if (msg.content.startsWith('!spotify')) {
    var searchItem = ''
    var searchTrack = false
    var searchArtist = false
    var searchAlbum = false
    if (msg.content.substr(9, 5) === 'titre') {
      searchTrack = true
      searchItem = msg.content.substr(15, msg.content.length)
    } else if (msg.content.substr(9, 7) === 'artiste') {
      searchArtist = true
      searchItem = msg.content.substr(17, msg.content.length)
    } else if (msg.content.substr(9, 5) === 'album') {
      searchAlbum = true
      searchItem = msg.content.substr(15, msg.content.length)
    } else {
      searchItem = msg.content.substr(9, msg.content.length)
    }
    console.log(searchTrack)
    console.log(searchArtist)
    console.log(searchAlbum)
    var SpotifyWebApi = require('spotify-web-api-node')
    var spotifyApi = new SpotifyWebApi({
      clientId: '34310d56bc4e479585c09dadc3877a88',
      clientSecret: 'ced4ae31372f4687906a5f069a325b55'
    })
    spotifyApi.clientCredentialsGrant()
    .then(function (data) {
      spotifyApi.setAccessToken(data.body['access_token'])
      var result = spotifyApi.search(searchItem, ['track', 'artist', 'album'], function (err, data) {
        if (err) {
          console.error('Something went wrong', err.message)
        }
      })
      result.then(function (result) {
        var i = 0
        var tracksIndex = 0
        var artistsIndex = 0
        var albumsIndex = 0
        var resultArray = []
        var limit = 0
        if (searchTrack) {
          limit = Math.min(result.body.tracks.items.length, 3)
          console.log(result.body.tracks.items.length)
        } else if (searchArtist) {
          limit = Math.min(result.body.artists.items.length, 3)
          console.log(result.body.artists.items.length)
        } else if (searchAlbum) {
          limit = Math.min(result.body.albums.items.length, 3)
          console.log(result.body.albums.items.length)
        } else {
          limit = Math.min(result.body.tracks.items.length + result.body.artists.items.length + result.body.albums.items.length, 3)
        }
        if (limit === 0) {
          msg.channel.send('aucun résultat')
        } else {
          while (i < limit) {
            if (result.body.tracks.items.length !== 0 && !searchArtist && !searchAlbum) {
              resultArray.push({'type': 'track', 'index': tracksIndex, 'name': result.body.tracks.items[tracksIndex].name})
              tracksIndex++
              i++
            }
            if (i < 3 && result.body.artists.items.length !== 0 && !searchTrack && !searchAlbum) {
              resultArray.push({'type': 'artist', 'index': artistsIndex, 'name': result.body.artists.items[artistsIndex].name})
              artistsIndex++
              i++
            }
            if (i < 3 && result.body.albums.items.length !== 0 && !searchArtist && !searchTrack) {
              resultArray.push({'type': 'album', 'index': albumsIndex, 'name': result.body.albums.items[albumsIndex].name})
              albumsIndex++
              i++
            }
          }
          for (i = 0; i < resultArray.length; i++) {
            if (resultArray[i].type === 'track') {
              if (resultArray[i].index === 0) {
                msg.channel.send('Titre(s) trouvé(s) :')
              }
              msg.channel.send(resultArray[i].name)
            }
          } for (i = 0; i < resultArray.length; i++) {
            if (resultArray[i].type === 'artist') {
              if (resultArray[i].index === 0) {
                msg.channel.send('Artiste(s) trouvé(s) :')
              }
              msg.channel.send(resultArray[i].name)
            }
          } for (i = 0; i < resultArray.length; i++) {
            if (resultArray[i].type === 'album') {
              if (resultArray[i].index === 0) {
                msg.channel.send('Album(s) trouvé(s) :')
              }
              msg.channel.send(resultArray[i].name)
            }
          }
        }
      })
    })
  } else if (msg.content.startsWith('!youtube')) {
    var youSearch = ''
    if (msg.content === '!youtube hello') {
      msg.channel.sendMessage('youtube hello to you too')
    } else if (msg.content.startsWith('!youtubeSearch')) {
      youSearch = msg.content.substr(15, msg.content.length)
      getreq({ url: 'https://www.googleapis.com/youtube/v3/search?q=' + youSearch + '&part=snippet&key=AIzaSyAtGurwN6GfssCwVSHXzPRbA4ofxYM5FRo', json: true }, function (error, response, dataYoutube) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          if (dataYoutube.items && dataYoutube.items.length > 2) {
            msg.channel.sendMessage('Les trois premiers résultats sont ' + dataYoutube.items[0].snippet.title +
             ' ; ' + dataYoutube.items[1].snippet.title + ' et ' + dataYoutube.items[2].snippet.title + '.')
          } else {
            msg.channel.sendMessage(youSearch + ' Pas de résultats.')
          }
        }
      })
    } else if (msg.content.startsWith('!youtubeVideo')) {
      youSearch = msg.content.substr(14, msg.content.length)
      getreq({ url: 'https://www.googleapis.com/youtube/v3/search?q=' + youSearch + '&type=video&part=snippet&key=AIzaSyAtGurwN6GfssCwVSHXzPRbA4ofxYM5FRo', json: true }, function (error, response, dataYoutube) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          if (dataYoutube.items && dataYoutube.items.length > 2) {
            msg.channel.sendMessage('Les trois premières vidéos sont ' + dataYoutube.items[0].snippet.title +
             ' ; ' + dataYoutube.items[1].snippet.title + ' et ' + dataYoutube.items[2].snippet.title + '.')
          } else {
            msg.channel.sendMessage(youSearch + ' Pas de résultats.')
          }
        }
      })
    } else if (msg.content.startsWith('!youtubeChannel')) {
      youSearch = msg.content.substr(16, msg.content.length)
      getreq({ url: 'https://www.googleapis.com/youtube/v3/search?q=' + youSearch + '&type=channel&part=snippet&key=AIzaSyAtGurwN6GfssCwVSHXzPRbA4ofxYM5FRo', json: true }, function (error, response, dataYoutube) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          if (dataYoutube.items && dataYoutube.items.length > 2) {
            msg.channel.sendMessage('Les trois premiers channels sont ' + dataYoutube.items[0].snippet.title +
             ' ; ' + dataYoutube.items[1].snippet.title + ' et ' + dataYoutube.items[2].snippet.title + '.')
          } else {
            msg.channel.sendMessage(youSearch + ' Pas de résultats.')
          }
        }
      })
    } else if (msg.content.startsWith('!youtubePlaylist')) {
      youSearch = msg.content.substr(17, msg.content.length)
      getreq({ url: 'https://www.googleapis.com/youtube/v3/search?q=' + youSearch + '&type=playlist&part=snippet&key=AIzaSyAtGurwN6GfssCwVSHXzPRbA4ofxYM5FRo', json: true }, function (error, response, dataYoutube) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          if (dataYoutube.items && dataYoutube.items.length > 2) {
            msg.channel.sendMessage('Les trois premières playlist sont ' + dataYoutube.items[0].snippet.title +
             ' ; ' + dataYoutube.items[1].snippet.title + ' et ' + dataYoutube.items[2].snippet.title + '.')
          } else {
            msg.channel.sendMessage(youSearch + ' Pas de résultats.')
          }
        }
      })
    }
  } else if (msg.content.startsWith('!translate')) {
    var split = msg.content.split(' ')
    var texteatraduire = msg.content.substring(12 + split[1].length)
    var langue = split[1]
    translate.translate(texteatraduire, langue, function (err, translation) {
      if (!err) {
        msg.channel.sendMessage(translation)
      } else {
        msg.channel.sendMessage(err)
      }
    })
  } else if (msg.content.startsWith('!weather')) {
    var apiKey = 'a77909704b3376d3191160db31e65494'
    var city = ''
    if (msg.content.startsWith('!weatherToday')) {
      city = msg.content.substr(14, msg.content.length)
      getreq({ url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, json: true }, function (error, response, dataWeather) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          if (dataWeather.name) {
            msg.channel.sendMessage('a ' + dataWeather.name + ' il y a ' + getWeatherStatus(dataWeather.weather[0].id))
          } else {
            msg.channel.sendMessage(city + ' ? .... Is that even a real city ?')
          }
        }
      })
    } else if (msg.content.startsWith('!weatherFuture')) {
      city = msg.content.substr(15, msg.content.length)
      getreq({ url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey, json: true }, function (error, response, dataWeather) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          var phrase = ''
          if (dataWeather.city.name) {
            msg.channel.sendMessage('a ' + dataWeather.city.name)
            dataWeather.list.forEach(function (element) {
              phrase = phrase + 'le ' + element.dt_txt + ' il y aura ' + getWeatherStatus(element.weather[0].id) + ', '
            }, this)
            msg.channel.sendMessage(phrase)
          } else {
            msg.channel.sendMessage(city + ' ? .... Is that even a real city ? Well anyway there is an error...')
          }
        }
      })
    }
  } else if (msg.content.startsWith('!pokemon')) {
    // pokemon transformation and evolution
    if (msg.content.startsWith('!pokemonTf')) {
      // we want to transform our avatar into a pokemon
      var pokemon = msg.content.substr(11, msg.content.length)
      getreq({ url: 'http://pokeapi.co/api/v2/pokemon/' + pokemon, json: true }, function (error, response, dataPokemon) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(' connection error ')
        } else {
          if (dataPokemon.name) {
            client.user.setAvatar(dataPokemon.sprites.front_default)
            client.user.setUsername(dataPokemon.name)
            if (dataPokemon.name !== client.user.username) {
              msg.channel.sendMessage('Sorry you can only change my avatar and username twice every two hours : ask discord why :(')
            }
            msg.channel.sendMessage('Hello I am ' + dataPokemon.name + ' and I weight ' + dataPokemon.weight + '. I am ' +
            dataPokemon.height + ' feet tall. My id is ' + dataPokemon.id + '. My main type is ' +
              dataPokemon.types[0].type.name + '.')
          } else {
            msg.channel.sendMessage(pokemon + ' ? .... Is that even a real pokemon ? Well anyway there is an error...')
          }
        }
      })
    } else if (msg.content.startsWith('!pokemonEv')) {
      // we want to evolve our pokemon if possible
      getreq({ url: 'http://pokeapi.co/api/v2/pokemon-species/' + client.user.username, json: true }, function (error, response, dataPokemon) {
        // load our avatar pokemon infos
        if (error) {
          // oh no !!!
        } else {
          getreq({ url: dataPokemon.evolution_chain.url, json: true }, function (error, response, dataChain) {
            // load our avatar pokemon evolution chain
            if (error) {
              // oh no !!!
            } else {
              // search for a possible evolution
              var myPokeName = client.user.username
              var chain = dataChain.chain
              while (chain && chain.species && myPokeName === client.user.username) {
                var pokeName = chain.species.name
                if (pokeName === client.user.username && chain.evolves_to.length > 0) {
                  myPokeName = chain.evolves_to[0].species.name
                }
                chain = chain.evolves_to[0]
              }
              if (myPokeName === client.user.username) {
                msg.channel.sendMessage('I dont have any evolution !')
              }
              // msg.channel.sendMessage('test ' + myPokeName)
              getreq({ url: 'http://pokeapi.co/api/v2/pokemon/' + myPokeName, json: true }, function (error, response, dataEvolution) {
                // load our new pokemon infos
                if (error) {
                  // oh no !!!
                } else {
                  client.user.setAvatar(dataEvolution.sprites.front_default)
                  client.user.setUsername(dataEvolution.name)
                  if (dataEvolution.name !== client.user.username) {
                    msg.channel.sendMessage('Sorry you can only change my avatar and username twice every two hours: ask discord why :(')
                  }
                  msg.channel.sendMessage('Hello I am ' + dataEvolution.name + ' and I weight ' + dataEvolution.weight + '. I am ' +
                  dataEvolution.height + ' feet tall. My id is ' + dataEvolution.id + '. My main type is ' +
                    dataEvolution.types[0].type.name + '.')
                }
              })
            }
          })
        }
      })
    }
  }
})

client.login(config.token)

Twitter.stream('statuses/filter', {track: '@bot_test_labs'}, function (stream) {
  // ... when we get tweet data...
  stream.on('data', function (tweet) {
    // print out the text of the tweet that came in
    if (sendChannelTwitter != null) {
      sendChannelTwitter.sendMessage(' Whaaaarg Incoming message from twitter : ' + tweet.text)
    }
  })

  // ... when we get an error...
  stream.on('error', function (error) {
    console.log(error)
  })
})
