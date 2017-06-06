import test from 'ava'
var TwitterPackage = require('twitter') // get twitter library
var secret = {// sets my twitter app information
  consumer_key: '7v9mpULXoh9mDDIzO2oi7RTB8',
  consumer_secret: 'eqcUnEdb6gqLMExzBbOm8tORbs9PXsmi43ZO0KM4kXISMTfLFN',
  access_token_key: '865466541730447360-HzRxxXsrnvjRdkKqaYIJBVyWWNqnDnl',
  access_token_secret: 'kMvgAOn1SFhJroZ3nCznyaxenYid24oVBZHmDji76PtWm'
}
var Twitter = new TwitterPackage(secret)
var params = {screen_name: 'nodejs'}

test.cb('twitter unitaire', t => {
  Twitter.get('https://api.twitter.com/1.1/account/settings.json', params, function (error, tweets, response) {
    if (!error) {
      // t.is(typeof tweets, 'string')
      t.is(response.statusCode, 200)
      t.pass('twitter ok')
      t.end()
    } else {
      t.fail()
      t.end()
      throw error
    }
  })
})
