import requests
import json
import ipdb
import sys



def scrape():
    url = 'https://api.github.com/search/repositories?q=language:python&sort=stars&page='
    filename = "pythonRepos.json"
    repos = list()
    counter = 1
    auth = ()# (username, password)
    
    
    
    for pageNum in range(1,6):
        res = requests.get('{}{}'.format(url, pageNum))
        if res.ok:
            fullData = json.loads(res.text)

            for repo in fullData['items']:
                contribUrl = repo['contributors_url']
                pullsUrl = repo['pulls_url'][:-9]
                emptyResponse = False
                contributors = set()

                # totalConrib = 0
                contribPageNum = 1
                pullsPageNum=1
                
                # Scrape contributors
                while not emptyResponse:
                    contribRes = requests.get("{}?anon=true&page={}".format(contribUrl, contribPageNum), auth=auth)
                    if contribRes.ok:
                        contribJson = json.loads(contribRes.text)
                        
                        if len(contribJson)>0 and counter!=38: 
                            # totalConrib += len(contribJson)
                            # contribPageNum += 1
                            for item in contribJson:
                                if item['type'] == 'User':
                                    contributors.add(item['login'])
                                else:
                                    contributors.add(item['name'])

                            contribPageNum += 1
                                
                            
                        else:
                            emptyResponse = True
                    else:
                        print "Response exiting\nResponse status {}\nPage {}".format(contribRes.status_code, contribPageNum)
                        print str(contribRes.text)
                        print "X-RateLimit-Remaining: {}".format(contribRes.headers['X-RateLimit-Remaining'])
                        print "X-RateLimit-Reset: {}".format(contribRes.headers['X-RateLimit-Reset'])
                        print "problem occured in contributors scraping" 
                        sys.exit(0)
                # Scrape pull requests
                
                emptyResponse = False
                monthlyPulls = dict()
                quarterlyPulls = {'1':0, '2':0, '3': 0, '4':0}
                totalPulls = 0
                totalQuarterPulls = 0
                while not emptyResponse:
                    # ipdb.set_trace()
                    # print pullsPageNum

                    # Get response data
                    pullsRes = requests.get("{}?state=all&page={}".format(pullsUrl, pullsPageNum), auth=auth)
                    if pullsRes.ok:
                        pullsJson = json.loads(pullsRes.text)

                        if len(pullsJson) > 0 and counter!=38:
                            for item in pullsJson:
                                pullMonth = item['created_at'].split('-')[1]
                                pullYear = item['created_at'].split('-')[0]

                                # Insert to quarterly pulls
                                intMonth = int(pullMonth)
                                if int(pullYear) == 2015:
                                    if intMonth>=1 and intMonth<=3:
                                        quarterlyPulls['1'] += 1

                                    elif intMonth >=4 and intMonth<=6:
                                        quarterlyPulls['2'] += 1

                                    elif intMonth >=7 and intMonth<=9:
                                        quarterlyPulls['3'] += 1

                                    else:
                                        quarterlyPulls['4'] += 1


                                # insert monthly pulls
                                if monthlyPulls.has_key(pullMonth):
                                    monthlyPulls[pullMonth] += 1
                                else:
                                    monthlyPulls[pullMonth] = 1

                            pullsPageNum+=1
                
                        else:
                            emptyResponse = True

                    else:
                        print "Response exiting\nResponse status {}\nPage {}".format(pullsRes.status_code, pullsPageNum)
                        print str(pullsRes.text)
                        print "X-RateLimit-Remaining: {}".format(pullsRes.headers['X-RateLimit-Remaining'])
                        print "X-RateLimit-Reset: {}".format(pullsRes.headers['X-RateLimit-Reset'])
                        print "Problem occured in pull requests scraping"
                        sys.exit(0)
                # Calculate total pulls
                for v in quarterlyPulls.values():
                    totalQuarterPulls += v

                for v in monthlyPulls.values():
                    totalPulls +=v
                    


                tempRepo = dict()
                
                # Write pulls
                tempRepo['name'] = repo['name']
                tempRepo['quarterlyPulls'] = quarterlyPulls
                tempRepo['monthlyPulls'] = monthlyPulls
                tempRepo['totalQuarterPulls'] = totalQuarterPulls
                tempRepo['totalPulls'] = totalPulls
                
                # Write contributors
                tempRepo['total_contributors'] = len(contributors)
                tempRepo['url'] = repo['html_url']
                tempRepo['id'] = repo['id']
                repos.append(tempRepo)
                print '({}/600). analyzed {} with {} contributors and {} pull requests'.format(counter, repo['name'], len(contributors), totalPulls)
                counter+=1
                # ipdb.set_trace()
                
    with open(filename, 'w') as f:
        json.dump(repos, f)





 # 'headers': {'User-Agent': 'DrkSephy' },
          # If you don't want to get rate-limited, uncomment the following line
          # And add your Github username and password.
          # NOTE: Don't push to the repository with this data!
          # 'auth': {'user': 'your-github-username', 'pass': 'your-github-password'}




            
            





if __name__ == '__main__':
    scrape()