module.exports = { // 1 
    userController: require('./usercontroller'),
    journalController: require("./jounralcontroller"), // 2 
};

/*
1: We are exporting this file as a module. More specifically, we are exporting everything as an object.

2: We defin a property called jounralController. The value of this property is the import of the jounralcontroller file.


*/