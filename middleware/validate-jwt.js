const jwt = require("jsonwebtoken"); // 1
const {UserModel} = require("../models"); // 2

const validateJWT = async (req, res, next) => { // 3
    if (req.method == "OPTIONS"){ // 4
        next(); // 5
    }else if ( // 6
        req.headers.authorization &&
        req.headers.authorization.includes("Bearer")
    ) {
        const {authorization} = req.headers; // 7
        console.log("authroization -->", authorization);
        const payload = authorization // 8
        ? jwt.verify (
            authorization.includes("Bearer")
            ? authorization.split (" ")[1]
            : authorization,
            process.env.JWT_SECRET
            )
            : undefined;

            console.log("payload -->", payload)

        if (payload) { // 9
            let foundUser = await UserModel.findOne({where: {id: payload.id}}); // 10
            console.log("foundUser -->", foundUser);

            if (foundUser){ // 11
                console.log("request -->", req);
                req.user = foundUser; // 12
                next(); //13
            }else { // 14
                res.status(400).send({message: "Not authroized"});
            }
        }else { // 15
            res.status(401).send({message: "Invalid token"});
        }
    } else { // 16
        res.status(403).send({message: "Forbidden"});
    }
};

module.exports = validateJWT;


/*
1: We are going to be interacting with the token assinged to each session (whenever a user logs in or signs up.) This means that we need to import the JWT package, just as we did in our usercontroller

2: We also want to find out more information about a specific user. We need to communicate with our user model in our database.

3: An asynchronous fat arrow function called validateJWT is declared. This function takes in three parameters, req, res and next

4: The function starts with a conditional statement checking the method of the request. Sometimes, the request comes in as an OPTIONS rather than the POST, GET, PUT or DELETE. OPTIONS is the first part of the preflighted request. This is determined if the actual request is safe to send.

5: If we do have a preflight request, we pass it the thrid parameter declared in the asynchronous function. This asynchronous function is a middleware function and it is a part of express. Req, res and next are parameters that can only be accessed by express middleware functions. next() is a nested middleware function that, when called, passes control to the next middleware function.

6: If we are dealing with a POST, GET, PUT or DELETE request, we want to see if there is any data in authroization header of the incoming request AND if that string includes the word Bearer.

7: Next, we use object deconstruction to pull the value of the authroization header and store it in a variable called authorization.

8: 
    Lines 12, 13 and 19:
        - This is a ternary. This ternary verifies the token if authorization contains a truthy value. If it does not contain a truthy value, this ternary returns a value of undefined which is then stored in a variable called payload
    Lines 13,14,15,16 and 17:
        - If the token contains a truthy value, it does the following:
            -We call upon the JWT package and invoke the verify method.
                - jwt.verify(token, secretOrPublicKey, [options, callback])
                - the verify method decodes the token
                    - This method's first parameter is our token. The same variable as we declared on line 11
                    - The second parameter is the JWT_SECRET that we created in our .env file so the method can decrypt the token
        - On 14, 15 and 16 we're using more tenary to do some more checking
            - If we have a token that includes the word "Bearer", we extrapolate and return just the token from the whole string (authorization.split(" ")[1])
            - If the word "Bearer" was not incldued in the authorization header, then return just the token.
            
    - Long story short: dependent on the token and the conditional statement, the value of payload will either be the token excluding the word "Bearer" OR undefined.

9: Here is another conditonal statement that checks if, for a truthy value in payload

10: If payload comes back as a truthy value, we use Sequelize's findOne method to look for a user in our UserModel where the ID of the user in database matches the ID stored in the token. It then stores the value of the located user in a variable called foundUser

11: Another nested conditional statement. This one checks if the value of foundUser is truthy

12: *IMPORTANT*:
    - If we managed to find a user in the database that matches the information from the token, we create a new property called user to express's request object
    - The value of this new property is the information stored in foundUSer. Recall that this includes the email and password of the user.
    - This is crucial because we will now have access to this information when this big middleware function gets invoked.

13: Since we are creating a middleware function, we have access to that third parameter we established earlier: next(). The next function simply exits us out of this function.

14: If our code was unable to locate a user in the database, it will return a reponse with a 400 status code and a message that says "Not authorized."

15: If payload came back as undefined, we return a response with a 401 status code and a message that says "Invalid token"

16: If the authroization object in the headers object of the rquest is empty or does not include the word "Bearer", it will return a response with a 403 status code and message that says "Forbidden"



*/