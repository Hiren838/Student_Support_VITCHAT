import pandas as pd
import numpy as np
from pprint import pprint
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import LabelEncoder
# import pandas as pd
import json
import random
import spacy
import pickle

nlp = spacy.load("en_core_web_sm")


with open("intents.json", 'r') as f:
    data = json.load(f)

intents = data['intents']
rows = []

for intent in intents:
    patterns = "::::".join(intent['patterns'])
    tag = intent["tag"]
    responses = intent["responses"]
    rows.append([patterns,tag,responses])

df = pd.DataFrame(rows,columns=["Patterns","Tag","Responses"])  

def preprocess(txt):
    doc = nlp(txt.lower())
    not_punct = [] 
    for token in doc:
        if token.is_punct:
            continue
        not_punct.append(token.lemma_)
    return ' '.join(not_punct)

df_dummy = pd.DataFrame(columns= ["Patterns", "Tag"])


for i in range(len(df)):
  pat_sep = df["Patterns"].iloc[i].split('::::')
  lst = [df["Tag"].iloc[i]]*len(pat_sep)
  appendies = {
      "Patterns": pat_sep,
      "Tag": lst,
      "Responses": [df["Responses"][i]]*len(pat_sep)}
  df_dummy = pd.concat([df_dummy, pd.DataFrame(appendies)],axis = 0, ignore_index= True)

df_dummy["Patterns_preprocessed"] = df_dummy["Patterns"].apply(preprocess)
df_dummy["Patterns_preprocessed"] = df_dummy["Patterns_preprocessed"].replace('', np.nan)
df_dummy.dropna(axis = 0, inplace = True)


le = LabelEncoder()
df_dummy["Tag_encoded"] = le.fit_transform(df_dummy["Tag"])

X = df_dummy["Patterns_preprocessed"]
y = df_dummy["Tag_encoded"]


tf = TfidfVectorizer(
    encoding = 'ascii',
    decode_error='replace',
    max_features = 1000,
    analyzer='word',
    )

X_r = tf.fit_transform(df_dummy["Patterns_preprocessed"])




with open("train_model.pkl","rb") as file:
    model = pickle.load(file)


def get_responses(msg):
    msg = preprocess(msg)
    t_v = tf.transform([msg])
    pred = model.predict(t_v)
    
    i = 0
    for intent in df['Tag']:
        if le.inverse_transform([pred]) == intent:
            return random.choice(df['Responses'][i])
        i+=1
    return "I did'nt Understand" 


if __name__ == "__main__":
    print("Let's chat! (type 'quit' to exit)")
    while True:
        # sentence = "do you use credit cards?"
        sentence = input("You: ")
        if sentence == "quit":
            break

        resp = get_responses(sentence)
        print(resp)
