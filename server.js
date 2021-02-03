const express = require('express');
const app = express();

global.db = {
    DB_HOST:'127.0.0.1',
    DB_USER:'root',
    DB_PASS:'1234',
    DB_DATABASE:'delilah_resto'
}
//const db = require('./src/sql/conectionDB');
//require('./src/sql/conectionDB').insertTables();;

// routers
const usersRouter = require('./src/routes/users');
app.use('/users', usersRouter);

 const productsRouter= require('./src/routes/products');
app.use('/products', productsRouter);

const ordersRouter= require('./src/routes/orders');
app.use('/orders', ordersRouter);

const loginRouter= require('./src/routes/login');
app.use('/login', loginRouter);


app.listen('3000', () => {
    console.log("server listen")
})


