const { sequelize, Sequelize } = require("./models/index");
const express = require('express');
const app = express();
const port = process.env.PORT || 5000
const bodyParser = require('body-parser')
const cors = require('cors');
const committees = require('./routes/committees')
const users = require('./routes/users')
const login = require('./routes/login')
const tasks = require('./routes/tasks')

/* try {
    sequelize.sync({ force: true })
} catch (error) {
    console.log('e')
}
 */
try {
    app.use(express.json()); // built-in middleware for express
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/xwww-form-urlencoded
    app.use(cors());
    app.use('/committees', committees);
    app.use('/users', users);
    app.use('/login', login);
    app.use('/tasks', tasks);
} catch (error) {
    res.status(500).send({
        status: 'error',
        message: error
    })
}
// miidlewares


// creating a server
app.listen(port, () => console.log(`server listening on port ${port}...`))
