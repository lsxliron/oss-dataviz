import json, re
import ipdb



def sumFBTotal(filename, start, end):
    """
        Create a file that summarize the fbTotal files.
    """
    result = list()
    events = {"CommitCommentEvent": 0,
              "ForkEvent": 0,
              "WatchEvent": 0,
              "PullRequestEvent": 0,
              "PullRequestReviewCommentEvent": 0,
              "IssuesEvent": 0,
              "IssueCommentEvent": 0,
              "PushEvent": 0}

    for i in range(start, end+1):
        data = json.load(open("{}/{}".format(i, filename), 'r'))

        for item in data:
            events[item['name']] += item['count']
                
    for k,v in events.iteritems():
        result.append({"name": k, "count": v})

    with open(filename, 'w') as f:
        json.dump(result, f)




def sumTreemap(filename, start, end):
    """
        Create a file that summarize all the treemapData files
    """
    final = json.load(open("{}/{}".format(start, filename), 'r'))
    for i in range(start+1, end+1):
        temp = json.load(open("{}/{}".format(i, filename), 'r'))

        for child in temp['children']:
            lang = child['name']
            for repos in child['children']:
                repoName = repos['name']

                #Find the correct repo in the result
                for i in range(0,len(final['children'])):
                    if final['children'][i]['name'] == lang:
                        for j in range(0, len(final['children'][i]['children'])):
                            if repoName == final['children'][i]['children'][j]['name']:
                                final['children'][i]['children'][j]['CommitCommentEvent'] += repos['CommitCommentEvent']
                                final['children'][i]['children'][j]['ForkEvent'] += repos['ForkEvent']
                                final['children'][i]['children'][j]['IssueCommentEvent'] += repos['IssueCommentEvent']
                                final['children'][i]['children'][j]['IssuesEvent'] += repos['IssuesEvent']
                                final['children'][i]['children'][j]['PullRequestEvent'] += repos['PullRequestEvent']
                                final['children'][i]['children'][j]['PullRequestReviewCommentEvent'] += repos['PullRequestReviewCommentEvent']
                                final['children'][i]['children'][j]['PushEvent'] += repos['PushEvent']
                                final['children'][i]['children'][j]['WatchEvent'] += repos['WatchEvent']


    with open(filename, 'w') as f:
        json.dump(final, f)


def _getKeys():
    return {"Commits": [0]*5,
            "Pull Requests": [0]*5,
            "Pull Request Comments": [0]*5,
            "Issues":[0]*5}



def sumWeekly(filename, start, end):
    """
        Create a file that summarize all the weekly files
    """
    r = re.compile(r'(\d+)')
    days = [1, 6, 13, 20, 27]
    final = list()

    keys = _getKeys()

    # ipdb.set_trace()
    for i in range(start, end+1):
        data = json.load(open('{}/weekly.json'.format(i), 'r'))
        for item in data:
            day = re.search(r, item['date']).group()
            index = days.index(int(day))
            keys[item['name']][index] += item['count']

    
    for k,v in keys.iteritems():
        for i in range(0,5):
            final.append({"name": k, "date": "{}".format(days[i]), "count": v[i]})

    with open(filename, 'w') as f:
        json.dump(final, f)





def sumWdata(filename, start, end):
    """
        Create a file that summarize all the wdata files
    """
    r = re.compile(r'(\d+)')
    days = [1, 6, 13, 20, 27]
    temp = dict()
    final = dict()
    last = None
    for i in range(start, end+1):
        data = json.load(open('{}/wdata.json'.format(i), 'r'))
        
        for k in  data.keys():
            if not temp.has_key(k):
                temp[k] = _getKeys()

            for item in data[k]:
                day = re.search(r, item['date']).group()
                index = days.index(int(day))
                temp[k][item['name']][index] += item['count']
                

    for k,v in temp.iteritems():
        final[k] = list()
        for key, val in v.iteritems():
            for i in range(0,5):
                final[k].append({"name": key, "date": "{}".format(days[i]), "count": val[i]})

    with open(filename, 'w') as f:
        json.dump(final, f)

                

def main():
    sumFBTotal('fbTotal.json', 1, 4)
    sumTreemap('treemapData.json', 1, 4)
    sumWeekly('weekly.json', 1, 4)
    sumWdata('wdata.json', 1, 4)

    






if __name__ == '__main__':
    main()