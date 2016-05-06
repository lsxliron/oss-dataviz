import json
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

        # Look for the right key to place the value
        # ipdb.set_trace()
        for item in data:
            events[item['name']] += item['count']
                
                


    for k,v in events.iteritems():
        result.append({"name": k, "count": v})

    with open('fbTotal.json', 'w') as f:
        json.dump(events, f)









def main():
    sumFBTotal('fbTotal.json', 3, 4)

    






if __name__ == '__main__':
    main()

