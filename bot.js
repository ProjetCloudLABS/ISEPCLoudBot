const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
var getreq = require('request')
var translate = require('@google-cloud/translate')({
  key: 'AIzaSyA8VsE9eKIxKXSHPJq0x9sI4rYinB48UWE'
})

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

  } else if (msg.content.startsWith('!spotify')) {

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

  }
})

client.login(config.token)
