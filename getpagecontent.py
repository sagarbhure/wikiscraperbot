import requests
import wikipedia
import re
import string
from bs4 import BeautifulSoup
import warnings
import sys
import json

warnings.filterwarnings('ignore')
wikipedia.set_lang('en')

# rawobj = open('./public/data.json')
# rawdict = json.load(rawobj)
# raw = rawdict['wikidata']
# print(raw)

suggestioninput = sys.argv[1]               #SUGGESTION INPUT HERE sys.argv[1]
errorbool = False

try:
    url = wikipedia.page(suggestioninput).url
except:
    errorbool = True

filteredcontentoutput = ""

if errorbool == False:
    page = requests.get(url)
    parsedpage = BeautifulSoup(page.content, 'html.parser')
    contentdiv = parsedpage.find(id='mw-content-text')
    pelems = contentdiv.find_all('p')
    pelemstext = ""
    for pelem in pelems:
        pelemstext = pelemstext + pelem.text.strip()
        pelemstext = re.sub(r'\[.*?\]+', '', pelemstext)

    pelemstext = pelemstext.replace('\n', '')
    pelemstext = pelemstext.replace('"', '')
    # pelemstext = pelemstext.replace(';', '')
    # pelemstext = pelemstext.replace('{', '')
    # pelemstext = pelemstext.replace('}', '')
    pelemstextlist = pelemstext.split(' ')
    for filtertext in pelemstextlist:
        try:
            filtertext.encode('ascii').decode('ascii')
        except:
            # ASCII NOT pass
            filtertext = filtertext
        else:
            # ASCII PASS
            filteredcontentoutput = filteredcontentoutput + ' ' + filtertext    
            
    print(filteredcontentoutput)      #OUTPUT HERE    
else:
    print('No info found regarding the query.')


# try:
    # url = wikipedia.page(suggestioninput).url
    # filteredcontentoutput = ""

    # page = requests.get(url)
    # parsedpage = BeautifulSoup(page.content, 'html.parser')
    # contentdiv = parsedpage.find(id='mw-content-text')
    # pelems = contentdiv.find_all('p')
    # pelemstext = ""
    # for pelem in pelems:
    #     pelemstext = pelemstext + pelem.text.strip()

    # pelemstext = re.sub(r'\[.*?\]+', '', pelemstext)
    # pelemstext = pelemstext.replace('\n', '')
    # pelemstext = pelemstext.replace('"', '')
    # pelemstextlist = pelemstext.split(' ')
    # print(pelemstextlist)
    # for filtertext in pelemstextlist:
    #     try:
    #         filtertext.encode('ascii').decode('ascii')
    #     except:
    #         # ASCII NOT pass
    #         filtertext = filtertext
    #     else:
    #         # ASCII PASS
    #         filteredcontentoutput = filteredcontentoutput + ' ' + filtertext    
        
    # print(filteredcontentoutput)      #OUTPUT HERE

# except:
#     print('No info found regarding the query.')


