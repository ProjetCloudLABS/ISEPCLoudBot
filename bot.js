const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
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
    msg.channel.sendMessage('Whaaaaaaaaar')
  } else if (msg.content === 'goodbye') {
    msg.channel.sendMessage('whaaaaarha')
  } else if (msg.content.startsWith('!twitter')) {

  } else if (msg.content.startsWith('!spotify')) {

  } else if (msg.content.startsWith('!youtube')) {

  } else if (msg.content.startsWith('!translate')) {
    var texteatraduire = msg.content.split('!translate')
    translate.translate(texteatraduire[1], 'en', function (err, translation) {
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
