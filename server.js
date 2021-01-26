const express = require('express');
const app = express();
//const db = require('./src/sql/conectionDB');
require('./src/sql/conectionDB').createTables();


// routers
const usersRouter = require('./src/routes/users');
app.use('/users', usersRouter);

const loginRouter= require('./src/routes/login');
app.use('/login', loginRouter);



app.listen('3000', () => {
    console.log("server listen")
})


