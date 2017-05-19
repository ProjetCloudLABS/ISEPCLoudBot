const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()

var hearTwitter = false
var sendChannelTwitter

var TwitterPackage = require('twitter') // get twitter library
var secret = {// sets my twitter app information
  consumer_key: '7v9mpULXoh9mDDIzO2oi7RTB8',
  consumer_secret: 'eqcUnEdb6gqLMExzBbOm8tORbs9PXsmi43ZO0KM4kXISMTfLFN',
  access_token_key: '865466541730447360-HzRxxXsrnvjRdkKqaYIJBVyWWNqnDnl',
  access_token_secret: 'kMvgAOn1SFhJroZ3nCznyaxenYid24oVBZHmDji76PtWm'
}
var Twitter = new TwitterPackage(secret)

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
    if (msg.content.startsWith('!twitterPost')) {
      msg.channel.sendMessage('Whaar Sending arggg')
      msg.channel.sendMessage(msg.content.substr(13, msg.content.length))
      // sends the tweet :
      Twitter.post('statuses/update', {status: msg.content.substr(13, msg.content.length)},
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
      hearTwitter = true
      sendChannelTwitter = msg.channel
    }
    if (msg.content === '!twitterHelp') {
      msg.channel.sendMessage('Whaaar  use \'!twitterPost Yourmessage\' to send a tweet ; I am \'bot_test_labs\' on Twitter ')
      msg.channel.sendMessage('Whaaar  This bot will notify you when someone uses @bot_test_labs ')
    }
  } else if (msg.content.startsWith('!spotify')) {

  } else if (msg.content.startsWith('!youtube')) {

  } else if (msg.content.startsWith('!translate')) {

  } else if (msg.content.startsWith('!weather')) {

  }
})

client.login(config.token)

Twitter.stream('statuses/filter', {track: '#TechKnightsDemo'}, function (stream) {
  // ... when we get tweet data...
  stream.on('data', function (tweet) {
    // print out the text of the tweet that came in
    msg.channel.sendMessage(tweet.text)
  })

  // ... when we get an error...
  stream.on('error', function (error) {
    console.log(error)
  })
})
