
import * as GetData from './get-data'

exports.create = function (done: (err, data) => any) {
  GetData.create((err, data) => {
    done(err, {
      events: data
    })
  })
}