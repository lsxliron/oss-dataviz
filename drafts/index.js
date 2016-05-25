'use strict';

var utils = require('./js/utils');

// Fetch total number of JavaScript repositories
utils.fetchJSON('https://api.github.com/search/repositories?q=javascript')
.then((data) => {
  console.log('Total number of JavaScript repositories: ' + data.total_count);
});

// Fetch total number of JavaScript Issues
utils.fetchJSON('https://api.github.com/search/issues?q=javascript')
.then((data) => {
  console.log('Total number of JavaScript issues: ' + data.total_count);
});
