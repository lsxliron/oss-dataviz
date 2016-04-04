'use strict';

/**
 * Gathers all Facebook repositories.
*/

var fs = require('fs');
var utils = require('./scripts/utils');

let openIssues = 0;
let repositories = [];
// We can sort by forks, stars, etc.
let starUrls = [
  'https://api.github.com/orgs/facebook/repos?page=1',
  'https://api.github.com/orgs/facebook/repos?page=2',
  'https://api.github.com/orgs/facebook/repos?page=3',
  'https://api.github.com/orgs/facebook/repos?page=4',
  'https://api.github.com/orgs/facebook/repos?page=5',
  'https://api.github.com/orgs/facebook/repos?page=6'
]

let promises = starUrls.map((url) => utils.fetchJSON(url));

Promise.all(promises)
.then((results) => {
  results.forEach((result) => {
    result.forEach((item) => {
      repositories.push(item.full_name);
    });
  });
  console.log(repositories);
});