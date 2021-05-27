const { DataTypes } = require("sequelize"); // 1
const db = require("../db"); // 2

const User = db.define("user", { // 3
    email: { // 4
        type: DataTypes.STRING(100), // 5
        allowNull: false, // 6
        unique: true, // 7
    },
    password: { // 4
        type: DataTypes.STRING, // 5
        allowNull: false, // 6
    },
});

module.exports = User; // 8

/*

1: First, object destructing is used to extrapolate the DataTypes object from the sequelize dependency

2: We import the connection to our database that we set up in the db.js. This will unlock methods from the sequelize connection that we can call upon.

3: This is where the definition and creation of the model takes palce. We call .define() method. This is a Sequelize method that will map model properties in the server file to a table in Postgres. In the first argument of the define method, we pass in the string user. This will become a table called users ion Postgres (the table names are pluralized).

4: The next arguments of the define function (email and password) are objects. Any key/value pairs in the following objects will become columns of the table. The syntax looks a little weird here. Just know that it's an object that we can pass in numerous properties to create numerous table columns. This means that "email" and "password" will both be columns in our database.

5: DataTypes.STRING is our value for the type property for both "email" and "password". Because we define it as a STRING value in the model, any information to be held in that column MUST be a string data-type. DataTypes is a parameter in the function brought in through sequelize. Sequelize makes us declare the data types that we'll be storing.

6: This is an optional property you can all. allowNull: false simply means that you will be unable to send null data through. For this case: We will not be able to send an empty string through.

7: the unqiue: true property is another optional proeprty that means all data (in this case all emails) must be unique and you cannot have any duplicates. 

8: We lean on CommonJS to export the User Model in order to access it in other files in this application and to allow Sequelize to create the users table with the email and password columns the next time the server connects to the database and a user makes a POST reuqest that uses the model.



*/