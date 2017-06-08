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
    var searchItem = msg.content.substr(9, msg.content.length)
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
        while (i < 3) {
          if (result.body.tracks.total !== 0) {
            resultArray.push({'type': 'track', 'index': tracksIndex, 'name': result.body.tracks.items[tracksIndex].name})
            tracksIndex++
            i++
          } if (i < 3) {
            if (result.body.artists.total !== 0) {
              resultArray.push({'type': 'artist', 'index': artistsIndex, 'name': result.body.artists.items[artistsIndex].name})
              artistsIndex++
              i++
            }
          } if (i < 3) {
            if (result.body.albums.total !== 0) {
              resultArray.push({'type': 'album', 'index': albumsIndex, 'name': result.body.albums.items[albumsIndex].name})
              albumsIndex++
              i++
            }
          }
        }
        console.log(resultArray)
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
      })
    })
  } else if (msg.content.startsWith('!youtube')) {

  } else if (msg.content.startsWith('!translate')) {

  } else if (msg.content.startsWith('!weather')) {

  }
})

client.login(config.token)
