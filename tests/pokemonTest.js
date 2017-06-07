import test from 'ava'
var client = require('node-rest-client-promise').Client()

test('Example test', t => {
  return client.getPromise('http://pokeapi.co/api/v2/pokemon/abra/')
    .catch((error) => {
      t.fail()
      throw error
    })
    .then((res) => {
      console.log(res.response.statusCode)
      t.is(res.response.statusCode, 200)
    })
})
