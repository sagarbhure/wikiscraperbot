
#Meet Robo: your friend

# print("Start Chatbot file", flush=True, end='')

#import necessary libraries
import io
import random
import string # to process standard python strings
import warnings
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import warnings
import sys
import json
warnings.filterwarnings('ignore')

import nltk
from nltk.stem import WordNetLemmatizer
nltk.download('popular', quiet=True) # for downloading packages

# uncomment the following only the first time

# UNCOMMENT FOR FIRST TIME
# UNCOMMENT FOR FIRST TIME
# UNCOMMENT FOR FIRST TIME

#nltk.download('punkt') # first-time use only
#nltk.download('wordnet') # first-time use only


#Reading in the corpus
# s = input("trump or modi \n")
# print("Start Chatbot file", flush=True, end='')
# s = sys.argv[1] + ".txt"
# print(s, flush=True, end='')
# with open(s,'r', encoding='utf8', errors ='ignore') as fin:
#     raw = fin.read().lower()

# UNCOMMENT THE UPPER CODE FOR FIRST TIME


rawobj = open('./public/data.json')
rawdict = json.load(rawobj)
raw = rawdict['wikidata'][0]

#TOkenisation
sent_tokens = nltk.sent_tokenize(raw)# converts to list of sentences 
word_tokens = nltk.word_tokenize(raw)# converts to list of words

# Preprocessing
lemmer = WordNetLemmatizer()
def LemTokens(tokens):
    return [lemmer.lemmatize(token) for token in tokens]
remove_punct_dict = dict((ord(punct), None) for punct in string.punctuation)
def LemNormalize(text):
    return LemTokens(nltk.word_tokenize(text.lower().translate(remove_punct_dict)))


# Keyword Matching
GREETING_INPUTS = ("hello", "hi", "greetings", "sup", "what's up","hey",)
GREETING_RESPONSES = ["hi", "hey", "*nods*", "hi there", "hello", "I am glad! You are talking to me"]

def greeting(sentence):
    """If user's input is a greeting, return a greeting response"""
    for word in sentence.split():
        if word.lower() in GREETING_INPUTS:
            return random.choice(GREETING_RESPONSES)


# Generating response
def response(user_response):
    robo_response=''
    sent_tokens.append(user_response)
    TfidfVec = TfidfVectorizer(tokenizer=LemNormalize, stop_words='english')
    tfidf = TfidfVec.fit_transform(sent_tokens)
    vals = cosine_similarity(tfidf[-1], tfidf)
    idx=vals.argsort()[0][-2]
    flat = vals.flatten()
    flat.sort()
    req_tfidf = flat[-2]
    if(req_tfidf==0):
        robo_response=robo_response+"I did not find any relevant information."
        return robo_response
    else:
        robo_response = robo_response+sent_tokens[idx]
        return robo_response


flag=True
# print("ROBO: My name is Robo. I will answer your queries about Chatbots. If you want to exit, type Bye!")

try:
    while(flag==True):
        user_response = sys.argv[1]         # RESPONSE input
        user_response=user_response.lower()
        print(response(user_response), flush=True, end='') 
        sent_tokens.remove(user_response)
        break
except:
    print("I did not find any relevant information.")


    # if(user_response!='bye'):
    #     if(user_response=='thanks' or user_response=='thank you' ):
    #         flag=False
    #         print("You are welcome..")
    #     else:
    #         if(greeting(user_response)!=None):
    #             print(greeting(user_response))
    #             break
    #         else:
    #             # print("ROBO: ",end="")
    #             print(response(user_response), flush=True, end='') 
    #             sent_tokens.remove(user_response)
    #             break     
    # else:
    #     flag=False
    #     print("Bye! take care..")    
        
        

