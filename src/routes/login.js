const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());

async function validarUsuarioContrasena (username, password) {
    const validateQuery =  ` SELECT id, username, password,admin FROM users WHERE username = "${username}" AND password = "${password}"`;
    console.log({validateq : validateQuery})
    const [resultadoUsuarios] = await db.query(validateQuery, {raw:true});
    if(resultadoUsuarios.length > 0){ 
        return resultadoUsuarios
    }   
} 

router.post('/', async (req,res)=>{ 
    let {username, password} = req.body;
    const validado = await validarUsuarioContrasena(username, password);
    if(!validado){
        res.json({error: 'No existe el usuario o contraseña'});
        return;
    }
    const admin= validado[0].admin;
    const id= validado[0].id;

    const token = jwt.sign({
        id, username, password, admin,
    }, 'supEr5ecret4JWT');


   res.json({token}) 
});


module.exports = router;