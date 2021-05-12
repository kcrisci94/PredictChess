import time
import sys
import pymysql
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
#from xgboost import XGBClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score
from sklearn import metrics
import numpy as np

clf = RandomForestClassifier()

mydb = pymysql.connect(
   '127.0.0.1',
   'root',
   '@WSX2wsx',
   'project2'
)

arg1 = sys.argv[1]

#Build Dictionary to convert to Pandas dataframe
d = {'opening': [], 'opponent_rating': [], 'player_rating': [], 'white': [], 'black': [], 'win': []}
mycursor = mydb.cursor()
mycursor.execute("SELECT * FROM games WHERE whiteName=%s OR blackName=%s", (arg1, arg1))
myresult = mycursor.fetchone()
rate2 = 0  # opponent rating

# Build dictionary for modeling opponents games
while myresult is not None:
    if myresult[3] == arg1:
        d["white"].append(True)
        d["black"].append(False)
        d["player_rating"].append(myresult[8])
        d["opponent_rating"].append(myresult[9])
        rate2 = myresult[8]
        if myresult[6] == "White":
            d["win"].append(1)
        else: 
            d["win"].append(0)
    elif myresult[4] == arg1:
        d["white"].append(False)
        d["black"].append(True)
        d["player_rating"].append(myresult[9])
        d["opponent_rating"].append(myresult[8])
        rate2 = myresult[9]
        if myresult[6] == "Black":
            d["win"].append(1)
        else:
            d["win"].append(0)
    d["opening"].append(myresult[5])
    myresult = mycursor.fetchone()

# convert to pandas dataframe
df = pd.DataFrame(data=d)
# convert opening to a categorical variable
# df.opening = pd.Categorical(df.opening)
# df['opening_code'] = df.opening.cat.codes
#print(df['opening'])
list1 = df['opening'].unique()
#print(len(list1))
n = 1

myname = sys.argv[2]   # get my username
color = sys.argv[3]  # choose a color
selWhite = ''
selBlack = ''
#rate = sys.argv[4]   # choose my rating

if color == "White":
   selWhite = True
   selBlack = False
else:
   selBlack = True
   selWhite = False

for opening in list1:
    #print(opening)
    df = df.replace([opening], n)
    n = n + 1


# Build dictionary for modeling my games
mycursor2 = mydb.cursor()
mycursor2.execute("SELECT * FROM games WHERE whiteName=%s OR blackName=%s", (myname, myname))
myresult2 = mycursor2.fetchone()
rate3 = 0  # opponent rating
d2 = {'opening': [], 'opponent_rating': [], 'player_rating': [], 'white': [], 'black': [], 'win': []}

while myresult2 is not None:
    if myresult2[3] == myname:
        d2["white"].append(True)
        d2["black"].append(False)
        d2["player_rating"].append(myresult2[8])
        d2["opponent_rating"].append(myresult2[9])
        rate3 = myresult2[8]
        if myresult2[6] == "White":
            d2["win"].append(True)
        else: 
            d2["win"].append(False)
    elif myresult2[4] == myname:
        d2["white"].append(False)
        d2["black"].append(True)
        d2["player_rating"].append(myresult2[9])
        d2["opponent_rating"].append(myresult2[8])
        rate3 = myresult2[9]
        if myresult2[6] == "Black":
            d2["win"].append(True)
        else:
            d2["win"].append(False)
    d2["opening"].append(myresult2[5])
    myresult2 = mycursor2.fetchone()

# Convert to pandas dataframe
df2 = pd.DataFrame(data=d2)
# Get unique openings from mylist
#list2 = df2['opening'].unique()

#print(df2.head())
#Only look at wining rows
df2 = df2[~df2.win == False]
openingCounts = df2['opening'].value_counts()
names = openingCounts.index.tolist()
#print(openingCounts)


X = df[['white', 'player_rating', 'opponent_rating', 'opening']]
Y = df['win']

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.3) #70-30 split
# max features: number of options to be considered (variables)
#    - set to auto to take all features in every tree
# n_estimators: number of trees to build for random forest
#    - set too high, and code runs slow but predictions more accurate
# min_sample_leaf_size: smaller leaf size more prone to capturing noise in train data
# oob_score: tags every observation used in different trees and finds out max vote score
#    - based on only trees that did not use this observation in training
clf = RandomForestClassifier(max_features='auto', n_estimators=100, min_samples_leaf=50, oob_score=True)
#clf = LogisticRegression()
#clf = XGBClassifier()
#clf = SVC()
#clf = KNeighborsClassifier()
clf.fit(X_train, y_train)

# Get accuracy of model
y_pred = clf.predict(X_test)
retObj = {"Accuracy": 0, "Predicted Opening": ''}
retObj["Accuracy"] = metrics.accuracy_score(y_test, y_pred)

#print("Accuracy: ", metrics.accuracy_score(y_test, y_pred))

# run model to see which openings I will win with
n = 1
openingCountWins = []
#print("My rating: ", rate3, "Opponent_rating: ", rate2)
for opening in list1:
   y_pred2 = clf.predict([[selWhite, rate3, rate2, n]])
   if y_pred2 == True:
       openingCountWins.append(False)
   elif y_pred2 == False: 
       openingCountWins.append(True)
   n = n + 1

#print(openingCountWins)

# Return my most popular opening that results in a win against opponent
finalopening = ''
list1 = list1.tolist()
for i in names:
    if i in list1 and openingCountWins[list1.index(i)] == True:
        finalopening = i
        break

if finalopening == '':
    finalopening = names[0]

retObj["Predicted Opening"] = finalopening
print(retObj)

#sys.stdout.flush()


