const router = require("express").Router(); // 1
// const e = require("express");
const { UserModel } = require("../models"); // 2
const { UniqueConstraintError } = require("sequelize/lib/errors");
const jwt = require("jsonwebtoken");
const bcrypt = require ("bcryptjs");



router.post("/register", async (req, res) => { // 4

    let { email, password } = req.body.user; // 7
    try{ // 14
       const User = await UserModel.create({ // 9
            email, // 8
            password: bcrypt.hashSync(password, 13), // 25
        });

        let token = jwt.sign({id: User.id}, "process.env.JWT_SECRET", {expiresIn: 60 * 60 * 24}); // 23

        res.status(201).json({ // 11
            message: "User successfully registered", // 12
            user: User, // 13
            sessionToken: token // 24
        });
    } catch (err) { // 14
        if (err instanceof UniqueConstraintError){
            res.status(409).json({
            message: "Email is already in use",
        });
    } else {
        res.status(500).json({ // 15
            message: "Failed to register user",
        });

        }
    }

router.post("/login", async (req, res) =>{
    let { email, password } = req.body.user; // 16
    
    try{ 
        let loginUser = await UserModel.findOne({ // 17 
            where:{  // 18
                email: email, // 19
            },
        });
        
        
        if (loginUser){ // 20

            let passwordComparison = await bcrypt.compare(password, loginUser.password); // 26

            if (passwordComparison){ // 27 

                let token = jwt.sign({id: loginUser.id}, "process.env.JWT_SECRET", {expiresIn: 60 * 60 * 24});
                
                res.status(200).json({
                    user: loginUser,
                    message: "User successfully logged in!",
                    sessionToken: token
                });
            }else { // 28
                res.status(401).json({
                    message: "Incorrect email or password"
                })
            }

            } else { // 21
            res.status(401).json({ // 22
                message: 'Incorrect email or password' // 29
            });
         }
         }catch (error) {
            res.status(500).json({
                message: "Failed to log user in"
            })
            }  
        
    });

    // res.send("This is our user/register endpoint!") // 10

    // UserModel.create({ // 5 
    //     email: "user@email.com", // 6
    //     password: "password1234"
    // })
});






module.exports = router; // 3

/*

1: We have combined two lines of code. We import the Express framework and access the Router() method, assigning it to a variable called router. Recall that we are setting this variable as a const because we don't want to be able to change the value of this variable.

2: We use object deconstructing to import the user model and store it in UserModel variable. It is convention to use Pascal casing (uppercase on both words) for a model class with Sequelize. You'll find this to be true in other programming languages as well.

3: We export the module for usage outside of the file.

4: We use the router object by using the router variable to get access into the Router() object methods.
    - post() is one of the methods in the object, and we call it here. This method allows us to complete an HTTP POST request. We pass two arguments into the .post method.
    - The first argument '/register' is the path. Similar to how we used the /test path to test out Postman previously
    - The second argument is the asynchronous callback function. This is also sometimes called a "handler function". This function gets called when the application reeives a request to the specified route and HTTP method. The application "listens" for requests that match the specified route(s) and method(s), and when it detects a match, it calls the specified callback function. In our case, we wrote the syntax for this callback function to be an anonymous fat-arrow function that is.

5: Here we are doing two things:
    1 - We user the UserModel variable we created to access the model that we created. This will grant us access to the UserModel model properties and to Sequelize methods.
    2 - .create() is a Sequelize method that allows us to create an instance of the User model and send it off to the database, as long as the data types match the model.

6: We send the data we want our user to consist of in our create() method. 
    - currently our user data (user@email.com and password) is hardcoded. This is not a good practice since we want, at some point, for users to input THEIR email and password information. On top of that, when we attempt to send more than one request, our code will throw us an error because our database will allow only ONE instance of a user to have this email address. We set this up in our UserModel model. 
    - The left-hand side of this object has to match our User model, while the right-hand side is hor our request has to look when we send it.


7: We are using object deconstruction to take parse the request. We use the req.body middleware provided by Express and append two properties or key-value pairs to it. This is what we're sending to the databse. 
    - req is the actual request, and body is where our data is being held. user is a property of body while email and password are properties of user.
    - It looks like this:
            "req":{
                "body": {
                    "user":{
                        "email":
                        "password":
                    }
                }
            }

8: The information we extrapolated using object deconstruction will now be stored when we create our user.

9: We can communicate with or query from a model in our database, this action returns a Promise. We can capture this promise with the await keyword when successful. We don't want to store the data we get back from the database, so we do not assign the information capture in a variable as we may have done in the past. 

10: Once we have created our user, only then do we want the send a response back indicatin a success.

11: In our response, rather than res.send(), we will invoke two methods: .status() and .json() method.
    - .status()
        - This allows us to add a status code to a response. This will be a helpful tool in the future when we start working with error handling
        - In our case, we have successfully created an item. This is the perfect time to use a 201 status code(201:created)
    - .json()
        - This will, of course, package our response as json
        - what is the different between res.send() and res.json()?
            - There is not much different about the two methods. The two are pratically identical. They can both pass objects and arrays. res.json() even calls .send at the end of its action. The only difference is the fact that res.json() will convert non objects (such as null or undefined) into valid JSON while res.send() cannot.

12: On top of a 201 status code, it is always best to add a message to our response with more information

13: The same data that waas added to the database and stored in the User variable is now being sent to the client and stoed in a user property. user is the key, User is the value

14: The addition we have made here is to wrap our code in a try...catch statement. Try...catch statements are part of JavaScript that allows a section of code to be attempted
 
15: Similar to promise rejection, if the code fails, it will throw an expection which we can capture and use that to convey a message to the client via our response. This time, we want it to send a 500 status code and a message that says "Failed to register use". This will make it clear to the client that something failed.

16: When users log in to their account, we need two things from them. Their email and password. We use object deconstruction to pull the email and password from the request.

17: The findOne() method is a Sequelize method that does exactly what it says: It tried to find one element from the matching model withing the database that we tell it to look for. This is called Data Retrieval. In our case, we are looking at our UserModel. We use the await keyword in order to run this code asynchronous

18: We can filter what we want to locate from our database with a where clause. where is an object within Sequelize that tells the database to look for something matching its properties.

19: In our case, we want to find a user that has a property of email whose value matches the value we send through our request (user@email.com). We are looking in the email column in the user table for one thing that matches the value passed from the client.

20: We created a conditional or an if statement where we check if our resposne has a true or false value. While null is not an error, it is a falsy value.

21: We add an else statement to catch untrue values. While null is not an error, it does have a falsy value which we can catch with this else statement.

22: We capture our response, set a status code of 401 and add an onject to our response where we send a message back in the response. A 401 status code is used to relay to the client that they are unauthorized to proceed, usually do to incorrect or missing

23: Several things are happening here:  
    - First we create a variable called token. Once created, this will store the token
    - Then, we call upon our jwt variable, which is referring to the jsonwebtoken dependecy we installed earlier
    - This dependency comes with a couple of methods. .sign() is the method we use to create the token. It takes at least 2 parameters: the payload and the signature. In addition, you can also supply some specific options or a callback
    - Our first parameter is the payload, or data we're sending. User.id is the primary key of the user table and is the number assigned to the user when created in the database. User refers to the variable we created, which captures the promise when we create a new user.
    - The second parameter is signature, which is used to help encode and decode the token. You can make it anything you want, and we will make this private later. IN our current code, our secret password is "i_am_secret"
    - We set an option to make the token expire. Here we're taking (second * minutes * hours), in other words, 1 day. JavaScript doing actual math to get this value

24: We are expanding our response a bit more. We have added a key of sessionToken and pass it the value of the token. The server has now assigned a token to a specific user, and the client, once we have one, will have that token to work with.

25: 
    - We dive into the function where we create our User object and locate the key of password. This is because we want our password to be encrypted as our user is being created.
    - In the password's value, we call upon our bcrypt variable, which is referring to the bcryptjs dependecy we imported earlier.
    - When we look at the documentation, we learn that bcrypt has a function called hashSync(). Let's look at the function's syntax:
        - The hashSync() fucntion accepts two arguments:
            - The first is a string. This string is the value we want hashed. In our code, we supply the original password. This reference of password is looking at the deconstructed variable (req.body.user.password)
            - The second argument is a string or number. This argument is the number of times we want our first argument salted. This argument defualts to 10. In our case, we tell the function to salt our password 13 times.
    - Encryption related words:
        - Hashing: Hashing an algorithm that performs a one-way calculation
        - Salting: Salting is the adding of random data to the hashed string.

26: - Before, we used bcrypt to encrypt the password. Now, we use it to encrypt the supplied password and compare it to the hashed value, the password in the datbase.
    - We are only using two of the four parameters this methods takes in. That's because the callback functions for this specifc method are optional
        - In our first argument, we pull in the password value from the current request, when the user is signing up (password is the deconstruction of the request for this method. It is equal to req.body.user.password)
        - The second argument pulls the hashed password value from the database (loginUser.password)
    - If the callback functions are omitted, the compare method returns a boolean in a promise, hence the await keyword. This promise is then captured in a variable called passwordComparison

27: If passwordComparison is true, meaning the hashed password in the database matches the one that has been entered, then run the remaining code in order to create a token and build the response. Remember, passwordComparison is just a boolean. So our if statement is just checking for a boolean value of true.

28: Here, we are handliong situations where the match fails. Our else statement catches if passwordComparison is false and send a response with the message of "incorrect email or password".

29: We updated the message to also say "Incorrect email or password."
    - Why the same message in both places?:
        - Status code 401 because both errors happen due to information recived from the client and not matching the information in the database, whether that is an incorrect email or password
        - We don't want to alert a potential hacker that they have the correct email but perhaps the wrong password. By handling our errors like this, we can pinpoint two possible locations and ensure user security.
*/