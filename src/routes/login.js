const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');
const jwt = require('jsonwebtoken');

router.post('/',(req,res)=>{
    const body = req.body;

});


module.exports = router