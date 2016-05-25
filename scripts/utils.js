var request = require('request');

module.exports = {
  fetchJSON: function(url) {
    return new Promise((resolve, reject) => {
      request.get(url,
        {
          'headers': {'User-Agent': 'DrkSephy' },
          // If you don't want to get rate-limited, uncomment the following line
          // And add your Github username and password.
          // NOTE: Don't push to the repository with this data!
          'auth': {'user': 'DrkSephy', 'pass': 'Sephiroth1025'}
        },
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