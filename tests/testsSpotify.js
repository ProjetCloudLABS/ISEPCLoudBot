import test from 'ava'
var SpotifyWebApi = require('spotify-web-api-node')
var spotifyApi = new SpotifyWebApi({
  clientId: '34310d56bc4e479585c09dadc3877a88',
  clientSecret: 'ced4ae31372f4687906a5f069a325b55'
})

spotifyApi.clientCredentialsGrant()
  .then(function (data) {
    spotifyApi.setAccessToken(data.body['access_token'])
  })

test('Example test', t => {
  spotifyApi.search('muse', ['track', 'artist', 'album'], function (err, data) {
    if (err) {
      console.error('Something went wrong', err.message)
    }
  })
  .catch((error) => {
    t.fail()
    throw error
  })
  .then((res) => {
    console.log(res.response.statusCode)
    t.is(res.response.statusCode, 200)
  })
})
