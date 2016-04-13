"""
This file contains functions to sum the total of all the events
"""

import json
import ipdb
def initEvents():
    """
        Initialize the events dictionary.

        Returns:
        --------
            dict
    """
    events = {'CommitCommentEvent': 0, 
              'ForkEvent': 0, 
              'IssueCommentEvent': 0, 
              'IssuesEvent': 0, 
              'PullRequestEvent': 0, 
              'PullRequestReviewCommentEvent': 0, 
              'WatchEvent': 0, 
              'PushEvent': 0}
    return events


def sumData(mode):
    """
        Sums the total facebook data according to the mode.

        Parameters:
        -----------
            mode : str
                If mode is "Q", the output will be 5 files:
                    - March 1st to March 6th (fb1.json)
                    - March 7th to March 13th (fb2.json)
                    - March 14th to March 20th (fb3.json)
                    - March 21th to March 27th (fb4.json)
                    - March 28th to March 31st (fb5.json)

                If mode is "T" the output is one file with the total for the whole month
    """
    events = initEvents()
    qCounter = 1
    for i in range(1,32):
        filename = "fb{}.json".format(i)

        with open(filename, 'r') as f:
            data = json.load(f)

        for repoName, repoData in data.iteritems():
            for k, v in repoData.iteritems():
                try:
                    events[k] += repoData[k]
                except:
                    ipdb.set_trace()

        if i in [6, 13, 20, 27, 31] and mode == "Q":
            qFilename = "fbQ{}.json".format(qCounter)
            with open(qFilename, 'w') as f:
                json.dump(events, f)
                qCounter += 1
            events = initEvents()

    if mode == "T":
        with open('facebookTotal.json', 'w') as f:
            json.dump(events, f)



def getTreemapData():
    """
    Constructs a dictionary with all the existing repositories in files 
    fb1.json ... jb31.json

    Returns
    -------
        dict
    """
    events = dict()
    repoNames = json.load(open('fb1.json','r')).keys()
    for repo in repoNames:
        events[repo] = initEvents()


    for i in range(1, 32):
        with open("fb{}.json".format(i), 'r') as f:
            data = json.load(f)

        for repoName, eventsDict in data.iteritems():
            for k, v in eventsDict.iteritems():
                events[repoName][k] += v

    return events


def generateTreemapData(events):
    """
    Constructs the data required for the treemap and saves the file locally.
    Dictionary structure:
    {
        "name" : "repos",
        "children" : 
        [
            {
                "name" : "prog. lang.",
                children:
                [
                    {
                        "name" : repo1,
                        "WatchEvent" : 1,
                        "IssueCommentEvent" : 2,
                    },
                    {
                        "name" : repo2,
                        "WatchEvent" : 3,
                        "IssueCommentEvent" : 4,
                    }
                }
            ],
            "name" : "prog. lang. 2",
            "children" : 
            [
                same structure as above...
            ]
        ]
    }

    Parameters:
    -----------
        events : dict
            The events to organize as a treemap data.
            Preferably, this parameters should be the return value of getTreemapData() function.
    """
    ipdb.set_trace()
    result = dict()
    result['name'] = 'repos'
    result['children'] = []
    langs = json.load(open('repoLanguagesV2.json', 'r'))

    for lang, repos in langs.iteritems():
        result['children'].append({"name":lang})
        position = len(result['children'])-1
        result['children'][position]['children'] = list()
        for repoName in repos:
            if repoName != 'facebook/fbtftp':
                events[repoName]['name'] = repoName[9:]
                result['children'][position]['children'].append(events[repoName])
            
        with open('treemapData.json', 'w') as f:
            json.dump(result, f)




def organizeRepoLanguages():
    """
    Constructs a dictionary in the following structure:
        {"language": [repo1, repo2] ... }

    This function saves the file locally.
    """
    data = json.load(open('repoLanguages.json', 'r'))
    result = dict()

    for i in range(0,len(data)):
        repoName = data[i].keys()[0]
        lang = data[i][repoName]['language']

        if result.has_key(lang):
            result[lang].append(repoName)
        else:
            result[lang] = [repoName]

    with open('repoLanguagesV2.json','w') as f:
        json.dump(result, f)



def main():
    # Uncomment the action to perform
    # sumData("Q")
    # sumData("T")
    # organizeRepoLanguages()
    # generateTreemapData(getTreemapData())
    return


if __name__ == '__main__':
    main()