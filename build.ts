
import * as GetData from './get-data'
import fs = require('fs')

var distDir = './dist'
var distFile = './dist/events.json'

try {
  fs.unlinkSync(distFile)
} catch (err) {
  console.warn('unable to delete data file')
}

try {
  fs.mkdirSync(distDir)
} catch (err) {
  console.warn('unable to create dir')
}


GetData.create((error, dataSummary) => {
  if (error) return console.error(error)
  else fs.writeFileSync(distFile, JSON.stringify(dataSummary, null, 2), 'utf8')
})
