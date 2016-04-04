"""
This file extracts data about Facebook repositories from github archive files.
To get an archive file per one day, use wget http://data.githubarchive.org/2016-03-02-{0..23}.json.gz
"""


import pandas
import json
import ipdb

def createDf(path, day, month="03", year="2016"):
    filesList = list()
    # PATH = "1"
    # DAY = "01"
    # MONTH = "03"
    # YEAR = "2016"
    
    dfs = list()
    for i in range(0, 24):
        filesList.append('{p}/{y}-{m}-{d}-{h}.json'.format(p=path, y=year, m=month, d=day, h=i))

    # Convert files to string lists
    for filename in filesList:
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

        # Create a dataframe
        dfs.append(pandas.DataFrame.from_dict(data))


    print "Createing master DataFrame"
    df = pandas.concat(dfs, ignore_index=True)
    

    return df



            


def getDataForDay(df, outFilename):
    fbRepos = ['facebook/codemod', 'facebook/hhvm', 'facebook/xhp-lib', 'facebook/pyre2', 'facebook/flashcache',
               'facebook/open-graph-protocol', 'facebook/facebook-android-sdk', 'facebook/facebook-ios-sdk',
               'facebook/pfff', 'facebook/php-webdriver', 'facebook/swift', 'facebook/nifty', 'facebook/folly', 'facebook/jcommon',
               'facebook/node-haste', 'facebook/sparts', 'facebook/facebook-oss-pom', 'facebook/caf8teen', 'facebook/watchman',
               'facebook/rocksdb', 'facebook/FBMock', 'facebook/libphenom', 'facebook/chef-utils', 'facebook/mysql-5.6', 'facebook/giraph', 
               'facebook/buck', 'facebook/commoner', 'facebook/xctool', 'facebook/emitter', 'facebook/hblog', 'facebook/react', 
               'facebook/fbthrift', 'facebook/fishhook', 'facebook/glusterfs', 'facebook/react-devtools', 'facebook/pyaib',
               'facebook/ios-snapshot-test-case', 'facebook/regenerator', 'facebook/rebound', 'facebook/easymock',
               'facebook/clang-as-ios-dylib', 'facebook/jest', 'facebook/origami', 'facebook/puewue-backend', 'facebook/puewue-frontend', 
               'facebook/mcrouter', 'facebook/conceal', 'facebook/planout', 'facebook/bistro', 'facebook/shortcuts-for-framer',
               'facebook/liblogfaf', 'facebook/Shimmer', 'facebook/chisel', 'facebook/facebook-clang-plugins', 'facebook/KVOController',
               'facebook/Specs', 'facebook/Tweaks', 'facebook/IT-CPE', 'facebook/augmented-traffic-control', 'facebook/pop',
               'facebook/Haxl', 'facebook/css-layout', 'facebook/facebook-php-sdk-v4', 'facebook/proguard', 
               'facebook/pose-aligned-deep-networks', 'facebook/fb-adb', 'facebook/tac_plus', 'facebook/facebook-php-ads-sdk', 'facebook/thpp',
               'facebook/AsyncDisplayKit', 'facebook/immutable-js', 'facebook/fblualib', 'facebook/flux', 'facebook/wdt', 'facebook/rebound-js', 
               'facebook/dfuse', 'facebook/osquery', 'facebook/jsx', 'facebook/facebook-python-ads-sdk', 'facebook/grocery-delivery', 
               'facebook/taste-tester', 'facebook/between-meals', 'facebook/fbpca', 'facebook/fatal', 'facebook/proxygen', 'facebook/powermock',
               'facebook/ds2', 'facebook/flow', 'facebook/fbnn', 'facebook/fbcunn', 'facebook/wangle', 'facebook/fbcuda', 'facebook/fbtorch',
               'facebook/react-native', 'facebook/iTorch', 'facebook/stetho', 'facebook/infer', 'facebook/mysqlclient-python', 
               'facebook/fixed-data-table', 'facebook/libafdt', 'facebook/FBFetchedResultsController', 'facebook/ThreatExchange', 
               'facebook/squangle', 'facebook/shimmer-android', 'facebook/nuclide', 'facebook/fresco', 'facebook/device-year-class', 
               'facebook/jscodeshift', 'facebook/openbmc', 'facebook/fboss', 'facebook/network-connection-class', 'facebook/componentkit', 
               'facebook/Stack-RNN', 'facebook/SCRNNs', 'facebook/C3D', 'facebook/react-native-applinks', 'facebook/PathPicker', 
               'facebook/CParser', 'facebook/gnlpy', 'facebook/fbjs', 'facebook/eyescream', 'facebook/FLAnimatedImage', 'facebook/fbpush', 
               'facebook/graphql', 'facebook/android-jsc', 'facebook/react-native-fbsdk', 'facebook/ztorch', 'facebook/luaffifb', 
               'facebook/hack-codegen', 'facebook/Recipes-for-AutoPkg', 'facebook/relay', 'facebook/NAMAS', 
               'facebook/screenshot-tests-for-android', 'facebook/facebook-sdk-for-unity', 'facebook/WebDriverAgent', 
               'facebook/FBSimulatorControl', 'facebook/ocpjbod', 'facebook/dataloader', 'facebook/homebrew-fb', 'facebook/bAbI-tasks', 
               'facebook/MemNN', 'facebook/xcbuild', 'facebook/Conditional-character-based-RNN', 'facebook/robolectric', 'facebook/SoLoader', 
               'facebook/mention-bot', 'facebook/fb-caffe-exts', 'facebook/facebook-java-ads-sdk', 'facebook/learningSimpleAlgorithms', 
               'facebook/MazeBase', 'facebook/transform', 'facebook/fb.resnet.torch', 'facebook/UdpPinger', 'facebook/fbtracert', 
               'facebook/draft-js', 'facebook/fb-util-for-appx', 'facebook/UETorch', 'facebook/facebook-instant-articles-sdk-php']




    # Create dicionaries for each repository
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


    for i in range(0, len(df)):
        
        # The statement can be removed. It is here just to track progress
        if i%1000 == 0: 
            print i
        
        # Iterate the DataFrame to get the results.
        row = df.iloc[i]
        if row['repo'].has_key('name'):
            if row['repo']['name'] in fbRepos:
                if events[row['repo']['name']].has_key(row['type']):
                    events[row['repo']['name']][row['type']] += 1

    # Save results as json
    json.dump(events, open(outFilename,'w'))
        


    

def main():
    # Get DataFrame
    df = createDf("2", "02")

    # Generate output file
    getDataForDay(df, "fb2.json")


if __name__ == '__main__':
    main()



