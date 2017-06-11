const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

client.on('ready', () => {
  console.log(`Logged in as ${client.user.username}!`)
})

client.on('message', msg => {
  // Check if the message has been posted in a channel where the bot operates
  // and that the author is not the bot itself
  if (msg.channel.type !== 'dm' && (config.channel !== msg.channel.id || msg.author.id === client.user.id)) return

  // If message is hello, post hello too
  if (msg.content === 'hello') {
    msg.channel.send('Whaaaaaaaaar')
  } else if (msg.content === 'goodbye') {
    msg.channel.send('whaaaaarha')
  } else if (msg.content.startsWith('!twitter')) {

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

  } else if (msg.content.startsWith('!translate')) {

  } else if (msg.content.startsWith('!weather')) {

  }
})

client.login(config.token)
