const Express = require('express'); // 1 
const router = Express.Router(); // 2
// let validateJWT = require('../middleware/validate-jwt'); //6 
const {validateJWT} = require('../middleware');
const { JournalModel } = require('../models');


router.get('/practice', (req, res) => {// 3  //7
    res.send('Hey!! This is a practice route!')  // 4
});

router.get('/about', (req, res) => {
    res.send("This is the about route!")
})


// ! JOURNAL CREATE

router.post('/create', validateJWT, async(req, res)=> { //8
    const {title, date, entry}= req.body.journal;
    const {id}= req.user; //9
    const jounralEntry = {
        title,
        date,
        entry,
        id
    }
    try {
        const newJournal = await JournalModel.create(jounralEntry); // 10
        res.status(200).json(newJournal); // 11
    }catch (err){
        res.status(500).json({error: err}); // 12
    }
    JournalModel.create(jounralEntry)
});

router.get("/about", (req, res) => {
    res.send("This is the about route!")
});



module.exports = router; // 5 


/*
1: We import the Express framework and store it inside the variable Express. This instance becomes our gateway to using Express Methods.

2: We create a new variable called router. Since the express variable gives us access into the express framwork, we can access express properties and methods by calling express.methodName(). Therefore, when we call Express.Router(), we are using the Express variable to access the Router() method. The Router() method will return a router object for us. 

3:We use the router object by using the router variable to get access to the Router() object methods. 
    - get() is one of the methods in the object, and we call it here. This method allows us to complete an HTTP GET request. We pass two arguments into the .get method.
    - The first argument '/practice' is the path. Similar to how we used the /test path to test out Postman previously.
    - The second argument is an anonymous callback function. This is also sometimes called a "handler function". This function gets called when the application receives a request to the specified route and HTTP method. The application "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function.

4: Inside our callback function, we call res.send(). send() is an express method that can be called on the res or response object. Our response parameter is just a simple string.

5: We exprot the module for usage outside of the file

6: We imported the validate-jwt middleware and assigned it to a variable called validateJWT 

7: We inject the validateJWT variable as a middleware function in the '/practice' route in the journalcontroller. It will check to see if the incoming request has a token for this specific route.

8: 
    - We decstruct the request's body that is holding a jounral, grabbing the title, date and entry. 
    - Next we retrieve the user's id who made the request (thanks to the validateJWT middleware) and finally create a variable called jounralEntry with each of these data pieces.
    - This variable is an object and a const which means the contents of this variable cannot be changed. Luckily, this is not a literal variable. This means we can dynamically change the values based on the user input, just as we did with our user signup method in the usercontroller.js  

9: This comes from validateJWT. We have access to the user object we created in the validateSession.js, which means we can use dotnotation to step into it and grab the user's id and assign it to a specific journal entry.

10: 
    - We use the journalEntry variable we created to access the model that we are using
    - the .create() is a Sequelize method that allows us to create an instance of the Journal model and send the journalEntry object we created off to the database. As long as the data types match the model.

11: If the creation is successful, the promise resolves and moves to this line, causing the server to send a response status of 200 OK and the newly created JSON-fied journal entry

12: If the creation has failed, the promise rejects and moves to this line due to the "catch", causing the server to capture that error and send 500 status code with the JSON-fied error message.
*/
