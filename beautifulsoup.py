import requests
import re
import string
from bs4 import BeautifulSoup

URL = "https://en.m.wikipedia.org/wiki/Narendra_Modi"
page = requests.get(URL)

# print(page.content)

parsedpage = BeautifulSoup(page.content, 'html.parser')

contentdiv = parsedpage.find(id='mw-content-text')

pelems = contentdiv.find_all('p')

pelemstext = ""

for pelem in pelems:
    pelemstext = pelemstext + pelem.text.strip()

pelemstext = re.sub(r'\[.*?\]+', '', pelemstext)
pelemstext = pelemstext.replace('\n', '')

pelemstextarr = pelemstext.split(' ')

filteredtext = ""

# regexcode = '[a-zA-Z]|[1-9]'

english_checksmall = re.compile(r'[a-z]')
english_checkcaps = re.compile(r'[A-Z]')

# for word in pelemstextarr:
#     if(word.isalpha() or word.isnumeric() or word.translate(string.punctuation).isalnum() or english_check.match(word)):
#         filteredtext = filteredtext + " " + word

# for word in pelemstextarr:
#     if(english_checksmall.match(word) or english_checkcaps.match(word) or word.isnumeric()):
#         filteredtext = filteredtext + " " + word

# for word in pelemstextarr:
#     if(re.findall(word, regexcode)):
#         filteredtext = filteredtext + " " + word

test = "hi my name aye jeff"
testmatches = re.findall('[a-zA-Z]|[1-9]', test)
if(testmatches and (test.isalpha() or test.isnumeric())):
    if(len(test) == len(testmatches)):
        print(testmatches)
    else:
        print('failed')
else:
    print('Nothing found')
# print(english_checksmall.match(test))
# getVals = list([val for val in pelemstext
#                if val.isalpha() or val.isnumeric()]) 
  
# result = "".join(getVals) 