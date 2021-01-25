const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');

router.use(bodyParser.json());

router.get('/',(req, res)=>{
    db.authenticate().then(async ()=>{
    const querySQL = ` SELECT * FROM users`;
    const [resultados] = await db.query(querySQL, {raw:true});
    res.send(resultados);
    });
});

router.post('/',(req,res)=>{
    const body = req.body;
    const requiredKeys = ["username", "password", "fullname", "email", "address", "phone"];
    const errors = [];
    for (const key of requiredKeys) {

        if (!body.hasOwnProperty(key)) {
            console.log(key)
            errors.push(key)
            //const element = object[key];  
        }
    } 
res.send(`Error  errors.length = 1 ? ` )

    if (errors.length > 0) {
        
        res.send(`Error - Campos Faltantes:`)
    }
    //if(!body.username){res.send('Falta campo username');}
    //if(!body.password){res.send('Falta campo password');}

    db.authenticate().then(async ()=>{
        // tu primer create [C]RUD
        const querySQL = `
        INSERT INTO users (username, password, fullname, email, address, phone)
         VALUES('${body.username}', '${body.password}', '${body.fullname}', '${body.email}', '${body.address}', ${body.phone});
        `;
        const [resultados] = await db.query(querySQL, {raw:true});
        if(resultados){
            res.send(req.body);
        }else{
            res.send(resultados);
        }
    })
});

router.get('/:id',(req,res)=>{

})

module.exports = router;