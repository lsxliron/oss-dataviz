'use strict';

/**
 * Computes total number of stars for a given language.
 * At the moment, it computes JavaScript repository stars.
 * This can be changed by changing the language filter in the urls.
 * Computes 20 pages of data at the moment. 
*/

var fs = require('fs');
var utils = require('./scripts/utils');

let openIssues = 0;

// We can sort by forks, stars, etc.
let starUrls = [
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=1',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=2',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=3',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=4',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=5',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=6',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=7',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=8',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=9',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=10',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=11',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=12',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=13',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=14',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=15',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=16',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=17',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=18',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=19',
  'https://api.github.com/search/repositories?q=language:java&sort=stars&page=20'
]

let promises = starUrls.map((url) => utils.fetchJSON(url));

Promise.all(promises)
.then((results) => {
  results.forEach((result) => {
    result['items'].forEach((item) => {
      openIssues += item.open_issues_count;
    });
  });
  console.log('Open Issue count: ' + openIssues);
});