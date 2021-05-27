require("dotenv").config();
const Express = require('express'); // 1
const app = Express(); // 2 

const dbConnection = require("./db"); // 3



app.use(Express.json()); // 13

const controllers = require("./controllers"); // 5  

app.use("/user", controllers.userController);

app.use(require("./middleware/validate-jwt")); // 14
app.use("/journal", controllers.journalController); // 6 


dbConnection.authenticate() // 7 
.then(() => dbConnection.sync()) // 8 
.then(() => {   // 9 
    app.listen(3000, () => {
        console.log(`[Server]: App is listening on 3000.`);
    });
})
.catch((err) => { // 10 
    console.log(`[Server]: Server crashed. Error = ${err}`);
});





// app.use('/test', (req, res) => {     // 4 
//     res.send('This is a message from the test endpoint on the server!')
// });

// app.listen(3000, () => { // 11 
//     console.log(`[Server]: App is listening on 3000.`) //12 
// });




/*

? NOTE:
- When we use the require('dependency') such as on line 1, we are importing and accessing dependencies we installed in our project. Our project's dependencies are house in the package.json. This is a great place to check for spelling errors.

- When we use the require('./foldername/filename') such as on 12 to access information, we are following our file structure to walk through our various folders and access the correct file or function. This is another place to check for spelling errors.

?

1: Here we require the use of the express npm package that we've installed in our dependencies

2: We create an instance of express. We're actually firing off a top-level Express() function, a function exported by the Express module. This allows us to create an Express app.

3: Create a db variable that imports the db file

4: When we go to the /test/ endpoint, we fire off an Express function res.send. res is short for response and handles packaging up the response object. the .send() method does the job of sending off the response.

5: import the controllers as a bundle through the object that we just exported in the index.js and store it in a variable called controllers.

6: we call app.use and in the first parameter create a base URL called /jounral. So our base URL will look like this: http://localhost:3000/journal . For our second parameter for the use() function we pass in the controllers object to use dotnotation to access the desire jounralController. This means that all routes create in the journalcontroller.js file will be sub-routes. It will look like this: http://localhost:3000/journal

7:  Two things are happening here: 1. We use the db variable to access the sequelize instance and its methods from the db file. 2. Call upon the authenticate() method. This is an asynchronous method that runs as SELECT 1+1 AS result query. This method returns a promise.

8: We use a promise resolver to access the returned promise and call upon the sync() method. This method will esnure that we sync all defined models to the database.

9: We use a promise resolver to acces the returned promise from the sync() method and fire off the function that shows if we are connected

10: We use a promise rejection that fires off an error if there are any errors.

11: app.listen will use express to start a UNIX socket and listen for connections on the given path. The given path is localhost:3000 indicated by the parameter of 3000.

12: We call an anonymous callback function when the connection happens with a simple console.log. This allows us to see a message with the port that the server is running on.

13: 
    - Express has functionality built into it, that allows it to be able to process requests that come into our server. And in order to use the req.body middleware, we need to use a middleware function called express.json(). Express needs to JSON-ify the request to be able to parse and interpret the body of data being sent through the request.
    - This app.use statement MUST go above any routes. Any routes above this statement will not be able to use the express.json() function, so they will break.
    - For our purposes, it's important to know this:
        - app.use(express.json()) tells the application that we want json to be used when we process this request.


14: We imported the validateJWT middleware, which will check to see if the incoming request has a token. Anything beneath the validateJWT will require a token to access, thus becoming protected. Anything aboe it will not require a token, remaining unprotected. Therefore, the user routes is not protected while the journal route is protected.
    - This doesn't work for us because we want all the routes to be protected but we need a few routes in the journalcontroller to be exposed to all users.
*/