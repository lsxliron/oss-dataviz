var request = require('request');

module.exports = {
  fetchJSON: function(url) {
    return new Promise((resolve, reject) => {
      request.get(url, { 'headers': {'User-Agent': 'DrkSephy' }},
      (error, response, body) => {
        if (body) {
          resolve(JSON.parse(body));
        } else {
          resolve({});
        }
      });
    });
  }
}