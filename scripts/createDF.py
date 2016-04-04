"""
This file extracts data about Facebook repositories from github archive files.
To get an archive file per one day, use wget http://data.githubarchive.org/2016-03-02-{0..23}.json.gz
"""


import json
from fbVars import *

def createValidJSON(filename):
    """
        Creates a valid dictionary from the github archive file.

        Parameters:
        -----------
            filename : str
                The filename to parse

        Return:
        -------
            dict

    """
    print "Processing {}".format(filename)
    with open(filename, 'r') as f:
        lines = f.readlines()

    dataStr = ""

    # Replace newline (\n) with a comma at the end of every line 
    # and create a long string from the data
    for line in lines:
        line.replace("\n","")
        line += ","
        dataStr += line

    # Add openning bracket ([)
    dataStr = "[" + dataStr

    # Remove comma from and add a closing bracket (])
    dataStr = dataStr[:-1] + "]"
    

    # Load as JSON
    data = json.loads(dataStr)

    return data


    

def getFBData(events, data):
    """
        Modifies the events object and adds to it facebook events counts

        Parameters:
        -----------
            events : dict
                The dictionary with the events as keys and the frequencies as values

            data : dict
                The data file to process. Basically, the return value from createValidJSON.

        Return
        ------
            dict
                The updated events counts
    """
    for i in range(0, len(data)):
        
        # Iterate the data to get the results.
        row = data[i]
        if row['repo'].has_key('name'):
            if row['repo']['name'] in fbRepos:
                if events[row['repo']['name']].has_key(row['type']):
                    events[row['repo']['name']][row['type']] += 1

    return events
    
    

def main():
    PATH = "2"
    DAY = "02"
    YEAR = "2016"
    MONTH="03"
    FILENAME = "fb22.json"
    
    print "Collecting data from {}-{}-{}. Files are at {}/" .format(MONTH, DAY, YEAR, PATH)
    # Create dictionaries for each repository
    events = dict()
    for item in fbRepos:
        events[item] = {'CommitCommentEvent': 0, 
                        'ForkEvent': 0, 
                        'IssueCommentEvent': 0, 
                        'IssuesEvent': 0, 
                        'PullRequestEvent': 0, 
                        'PullRequestReviewCommentEvent': 0, 
                        'WatchEvent': 0, 
                        'PushEvent': 0}

    
    # Get the events frequencies
    for i in xrange(0, 24):
        filename = '{p}/{y}-{m}-{d}-{h}.json'.format(p=PATH, y=YEAR, m=MONTH, d=DAY, h=i)
        data = createValidJSON(filename)
        events = getFBData(events, data)

    json.dump(events, open(FILENAME,'w'))


if __name__ == '__main__':
    main()