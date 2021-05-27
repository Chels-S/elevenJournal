const Sequelize = require('sequelize'); // 1 

const sequelize = new Sequelize("postgres://postgres:Cyanide13@localhost:5432/eleven-journal"); //2

module.exports = sequelize; // 3 


/*

1: import the sequelize package and create an instance of sequelize for use in the module with the Sequelize varable.

2: Use the constructor to create a new sequelize object. The constructor takes in a string which holds all of the pertinent data required to connect to a database, also known as a URI connection.

!closer look at this string:
   ? 'postgres://user:pass@example.com:5432/dbname
    - postgres = Identifies the database tablet to connect to. In our case, we are connecting to a postgres database
    - user = the username in order to connect to the database. In our case, this username is postgres
    - password = the password used for the local database. This is the password you used when you set up pgAdmin earlier and should be unique
    - example.com:5432 = The host points to the local port for Sequelize. This is 5432
    - dbname = The name we chose in order to identify a specific database.

3: we export the module.

*/