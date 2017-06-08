import test from 'ava'
var translate = require('@google-cloud/translate')({
  key: 'AIzaSyA8VsE9eKIxKXSHPJq0x9sI4rYinB48UWE'
})

test.cb('googletranslate test', t => {
  translate.translate('Bonjour', 'en', function (err, translation) {
    if (!err) {
      t.pass('google translate is ok')
      t.end()
    } else {
      t.fail()
      t.end()
      throw err
    }
  })
})
