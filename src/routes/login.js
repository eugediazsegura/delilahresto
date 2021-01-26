const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());

async function validarUsuarioContrasena(username, password){

    const usersQuery = ` SELECT username, password FROM users WHERE username = "${username}" AND password = "${password}"`;

    const [resultadoUsuarios] = await db.query(usersQuery, {raw:true});
    console.log(resultadoUsuarios)
/*     if(resultadoUsuarios.lenght > 0){
        return true
    }else{
        return false
    } */

    return resultadoUsuarios.length > 0

 /*    for (const iterator of Users) {
        
    }
    console.log(resultados[0].username) */
}

 router.post('/',async (req,res)=>{ 
    let {username, password} = req.body;
    const validado = await validarUsuarioContrasena(username, password);
    console.log("vali"+ validado)
    if(!validado){
        res.json({error: 'No existe el usuario o contraseña'});
        return;
    }

    const token = jwt.sign({
        username
    }, 'supEr5ecret4JWT');

    res.json({token})

});


module.exports = router