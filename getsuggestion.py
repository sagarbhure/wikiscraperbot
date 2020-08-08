import wikipedia
import json
import warnings
import sys
warnings.filterwarnings("ignore")
wikipedia.set_lang('en')

searchvar = sys.argv[1]        #INPUT SEARCH QUERY HERE
errorvar = False

try:
    searchresults = wikipedia.search(searchvar)
except:
    errorvar = True

if(errorvar == False):
    outputjson = {}
    outputjson['reasultlength'] = len(searchresults)
    for1int = 0

    for reasult in searchresults:
        outputjson[str(for1int)+'-reasult'] = reasult
        for1int = for1int + 1

    outputjsonstr = json.dumps(outputjson)
    print(outputjsonstr)      #OUTPUT HERE
else:
    outputjson = {}
    outputjson['reasultlength'] = "0"
    outputjsonstr = json.dumps(outputjson)
    print(outputjsonstr)      #OUTPUT HERE