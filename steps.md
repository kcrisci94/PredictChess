# Steps   
### Initial Setup   

1. Install npm, node.js, express, python, and mysql   
2. Created base application by cloning the [React Express Starter Pack](https://github.com/bradtraversy/react_express_starter) authored by Brad Traversy. This is a github repository set up so that the Express server can work with React.      

### Render the chessboard   

3. Install chessboard.jsx and add render the Chessboard component on the page. This is a "free chess" chessboard which doesn't care who's turn it is, or where the pieces are moved (i.e. it's not really chess).   
4. Install chess.js and create a Chess object that will interact with chessboard.jsx, enforcing rules of chess.   

### Create functionality to switch page views (will be used later)   

5. Create a new component called Page. This component will have a state attribute called 'title' which will control what page is being displayed (ex: login, game, predict, ...). Make the 'title' attribute value 'game' to start, since we haven't created other pages yet. Render the 'Game' component (which renders the Chessboard component) if the 'title' == 'game'.   

### Cycle forward through games and display positions on the board   

6. Create a new component called Gamelist, which will store a list of chess games. The component will have a state attribute called 'game' which will be initially hardcoded to an array of chess moves (ex: [e4, e5, kf3, ...]). It will also be rendered by Page when the 'title' is 'game'.   
7. Write the function in Page to start the game. This function will be passed as an attribute to Gamelist, and used as the handler for when a game is clicked on. It will update the 'moves' state attribute in Page.    
8. Add the 'moves' state attribute to the Page component to store the game moves (will be filled when a game from Gamelist is clicked on). Pass this state attribute as a prop to the Game component.   
9. Add the 'currentMove' state attribute to the Game component to track of which move we are on.   
10. Create a new component called Controls. This component will be rendered by Game. Download images of left and right arrows to be rendered by Controls. These arrows will cycle through the moves left and right and show the positions on the chess board.   
11. Create a function in Game that will make the next move in a sequence of moves. If the move is legal, then update the position on the board and increment the 'currentMove' Game state. This function will be passed to Controls and set as the onClick handler for the right arrow.   


### Cycle backward to a previous position in the game   

12. Create a new state attribute in Game called 'history'. This will be an array of previous game positions. Add code to the 'move-forward' function to add the previous position to the 'history' array, keeping track of all the moves that are made.   
13. Create a new function in Game called 'goToLast'. This function will load the position of the last entry in the history array. It will then remove the element from the array, and decrement the 'currentMove' Game state. This function will be passed to Controls and set as the onClick handler for the left arrow.   

### Set up database   

14. Create an account on mysql and write an init.sql file to initialize a new database. Add a users table and a games table. The games table will hold all the information for all the games that are downloaded.    
15. Ensure that the server.js file can communicate with mysql by adding the database info and mysql username and password to it.   

### Set up server to get games from chess.com api   
I spent a lot of time on this part. I tried multiple different methods of asyncronous functions using fetch and XMLHttpRequest. Sometimes a solution would work and other times it didn't so I assumed my code was wrong and kept changing it to try to make it work all the time. I even went so far as to [post](https://stackoverflow.com/questions/66606461/trouble-with-async-await-functions-with-multiple-api-calls) the question on StackOverflow, which didn't give me any help at all. Finally, I decided that there was nothing wrong with my code and that it had to be something else. I looked up the api limitations (which were really difficult to find). It turned out that although everyone gets unlimited requests, errors can occur when making multiple requests simultaneously (as in asynchronous functions). They state that when making multiple requests, we need to do them synchronously to ensure we don't overload the api. Once I discovered this, it went much faster.   

16. Write a function in server.js to get the archive list of games for a particular user. It takes in the url for the list of archives, and the username of the user in question. The url for the list of archives returns a list of other urls, which each have a list of games for a specific month (the exact date is at the end of the url). The function will first get the archive list of games. Then, it will query the mysql database for the maximum dated game that was played by the user. Next, it will cycle through the archive urls and look at the dates. If the dates are after the max date, then the function will make the request to the url one at a time using XMLHttpRequest with the async parameter set to false. Upon completion of each request, the function adds the object (a list of game objects) to a 'games' array in the function. Finally, the function passes this array of games to a new function 'parseData'.   
17. Experiment the returned data to figure out where all the game information is located. Most of it was located in a single string in an attribute called 'pgn'. In order to get this data, I had to write regular expressions that would get only specific information out of the strings. This information included 'whiteName', 'blackName', 'winner', and 'moves'. I also had to remove the newlines and escape characters from the string to make sure my regular expressions worked. I tested them in the console with multiple different pngs to make sure I was getting all the correct data (had to add small corrections to each of my regular expressions a few times before I got this working).   
18. Write a funciton in server.js that takes in an array of objects that contain lists of games. Use the regular expressions in the previous step to pull out the relevant data from each string for each game and insert the data into the Games table in mysql.   


### Add button to download all the user's games   
19. Create a new component called Options that will render buttons for the user to click on for different things that the application can do. Add the button that will download all the logged-in user's games from the chess.com api.    
20. Write the function in server.js to receive the request from the application, along with the chess.com username associated with the user. This function will build the url from the username and pass them both along to the function from step 16.   

### Render list of downloaded games on the screen   
21. Modify the Gamelist component to query the mysql database for downloaded games from the logged in user.   
22. Add 2 state attributes 'alllist' and 'display' to the Gamelist component to store the games that are recieved from the step above. 'alllist' will hold all of the games, and display will hold only 10 games at a time (because we don't want to display thousands of games on the screen).   
23. Make gamelist render the games in a table, setting the onClick attribute to a new function called 'startGame'. 
24. Write the function 'startGame' in the Page component. This function will get the list of moves that are associated with the game. This function will be passed to Gamelist as an attribute so that it can update the state to re-render the Game component with the moves of the game.   

### Add button to download games from other users   
19. Add another button to the Options component, along with an input textbox, and set the button handler to call a new function called 'getOtherGames'. 
20. Write the function 'getOtherGames' in the Options component. This function will get the username that was entered in the input textbox and call the same function that is called in step 19, only with the inputted username instead of the logged in user.   

### Create a new table to hold list of usernames a user has downloaded games from   
21. I modified the init.sql file to create a new table called addedUsers, along with a foreign key to the user table.
22. Next, I modified the server.js 'getData' function so that after it parses the games, it adds the user to the table in step 21.   
23. To prevent duplicate entries, I modified the init.sql file again to add a constraint **Unique** to the 'addedUsers' table. It looks at both the userID (foreign key of the user that did the downloading) and the username of the chess.com user who's games were downloaded as a key pair. If this pair exists already, it is not added to the table.   

### Display list of downloaded users on the screen   
24. Next, I added a function to the server.js file that would query the 'addedUsers' table for all the usernames that a logged in user has downloaded from.   
25. Next, I created a new component called SelectDisplay. This component is rendered by Page. This component has a state 'userlist' which is an array of users. When this component loads, it calls the function in step 24 to get the list of users and stores it in the 'userlist' state. This component renders the list of users from its state in an unordered list.    

### Allow users to switch the Gamelist view from their own games, to the games of other users   
26. To accomplish this, I had to push state from Game and Gamelist into Page. This is because I needed to call a new function called 'updateDisplay' when a username from SelectDisplay is clicked on, and have it change content in a sibling state, which is not possible. In order to affect the other components, this function had to have been passed down from Page, which means it has to modify the state there.   
27. I wrote the function 'updateDisplay' in the Page component which takes in the username that was clicked on and queries the mysql database for all games that that user has played in. It then sets the 'alllist' state to the list of games for that user, and the 'display' state to the 10 most recent games.   

 
