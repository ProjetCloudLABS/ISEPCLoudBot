const Discord = require('discord.js')
const config = require('./config.js')
const client = new Discord.Client()
var getreq = require('request')

var sendChannelTwitter = null

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

  } else if (msg.content.startsWith('!youtube')) {

  } else if (msg.content.startsWith('!translate')) {

  } else if (msg.content.startsWith('!weather')) {
    var apiKey = 'a77909704b3376d3191160db31e65494'
    var city = ''
    if (msg.content.startsWith('!weatherToday')) {
      city = msg.content.substr(14, msg.content.length)
      getreq({ url: 'http://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=' + apiKey, json: true }, function (error, response, dataWeather) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(city + ' ? .... Is that even a real city ?')
        } else {
          msg.channel.sendMessage('in ' + dataWeather.name + ' there is ' + dataWeather.weather[0].main)
        }
      })
    } else if (msg.content.startsWith('!weatherFuture')) {
      city = msg.content.substr(15, msg.content.length)
      getreq({ url: 'http://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey, json: true }, function (error, response, dataWeather) {
        if (error) {
          // oh no !!!
          msg.channel.sendMessage(city + ' ? .... Is that even a real city ? Well anyway there is an error...')
        } else {
          msg.channel.sendMessage('in ' + dataWeather.city.name)
          dataWeather.list.forEach(function (element) {
            msg.channel.sendMessage('at ' + element.dt_txt + ' there is ' + element.weather[0].main)
          }, this)
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
