import time
import sys
import pymysql
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn import metrics

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
while myresult is not None:
    if myresult[3] == arg1:
        d["white"].append(True)
        d["black"].append(False)
        d["player_rating"].append(myresult[8])
        d["opponent_rating"].append(myresult[9])
        if myresult[6] == "White":
            d["win"].append(True)
        else: 
            d["win"].append(False)
    elif myresult[4] == arg1:
        d["white"].append(False)
        d["black"].append(True)
        d["player_rating"].append(myresult[9])
        d["opponent_rating"].append(myresult[8])
        if myresult[6] == "Black":
            d["win"].append(True)
        else:
            d["win"].append(False)
    d["opening"].append(myresult[5])
    myresult = mycursor.fetchone()


df = pd.DataFrame(data=d)
#print(df['opening'])
list1 = df['opening'].unique()
#print(len(list1))
n = 1

for opening in list1:
    #print(opening)
    df = df.replace([opening], n)
    n = n + 1

#print(df.opening)

X = df[['white', 'black', 'player_rating', 'opponent_rating', 'opening']]
Y = df['win']

X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size = 0.3) #70-30 split
clf = RandomForestClassifier(n_estimators = 100)
clf.fit(X_train, y_train)

y_pred = clf.predict(X_test)

print("Accuracy: ", metrics.accuracy_score(y_test, y_pred))

sys.stdout.flush()


