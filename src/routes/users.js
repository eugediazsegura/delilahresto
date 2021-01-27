const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');
const validarToken = require('../middlewares');
const validateToken = require('../middlewares');
router.use(bodyParser.json());
router.use(validateToken)

router.get('/', (req, res)=>{
    db.authenticate().then(async ()=>{
    const querySQL = ` SELECT * FROM users`;
    const [resultados] = await db.query(querySQL, {raw:true});
        if(resultados.length < 1){
            res.status(404)
            res.send("Not Found : There are no users")
        }
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
        }
    } 
    
    if (errors.length > 0) {
        res.status(400)
        res.send(`Bad Request - Error: Los siguientes campos son requeridos: ${errors.join(', ')}` )
    }

    db.authenticate().then(async ()=>{
        const querySQL = `
        INSERT INTO users (username, password, fullname, email, address, phone)
         VALUES('${body.username}', '${body.password}', '${body.fullname}', '${body.email}', '${body.address}', ${body.phone});
        `;
        const [resultados] = await db.query(querySQL, {raw:true});
        if(resultados){
            res.status(201)
            res.send({status: 'Created', user: req.body});
        }else{
            res.send(resultados);
        }
    }).catch(e=>{
        res.status(500).send(e.parent.sqlMessage)
    })
});

router.get('/:id',(req,res)=>{
    db.authenticate().then(async ()=>{
        const id = req.params.id
        const querySQL = ` SELECT * FROM users WHERE id =${id}`;
        const [resultado] = await db.query(querySQL, {raw:true});
            if(resultado.length < 1){
                res.status(404)
                res.send("Not Found : The user doesn't exist.")
            }
        res.status(200)
        res.json({ OK: resultado});
        });
})


router.put('/:id',(req,res)=>{
    const id = req.params.id; 
    const body = req.body;
    const userKeys = ["username", "password", "fullname", "email", "address", "phone"];
    const editKeys = [];
    for (const key of userKeys) {

        if (body.hasOwnProperty(key)) {
            editKeys.push({[key] : body[key]})
        }
    } 

      db.authenticate().then(async ()=>{
        let querySQL = `
        UPDATE users
        SET `;
        for(let element of editKeys){
            for (const key in element) {
                const value = element[key];
                querySQL += `${key} = "${value}", `
            }
        }
        querySQL = querySQL.slice(0, -2)
        querySQL+= ` WHERE id= "${id}"`;

        const [resultado] = await db.query(querySQL, {raw:true});
        console.log(resultado)
        res.send(` OK Modified: ${req.body}`)  

    })  
})

router.delete('/:id',(req,res)=>{
    db.authenticate().then(async ()=>{
        const id = req.params.id
        const querySQL = ` DELETE FROM users WHERE id =${id}`;
        const [resultado] = await db.query(querySQL, {raw:true});
        res.send(` Delete user permanently: ${req.body}`);
        });
})

module.exports = router;