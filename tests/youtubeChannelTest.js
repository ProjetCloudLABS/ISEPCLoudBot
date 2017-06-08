import test from 'ava'
var client = require('node-rest-client-promise').Client()

test('youtube test', t => {
  return client.getPromise('https://www.googleapis.com/youtube/v3/search?q=nirvana&type=channel&part=snippet&key=AIzaSyAtGurwN6GfssCwVSHXzPRbA4ofxYM5FRo')
    .catch((error) => {
      t.fail()
      throw error
    })
    .then((res) => {
      console.log(res.response.statusCode)
      t.is(res.response.statusCode, 200)
    })
})
