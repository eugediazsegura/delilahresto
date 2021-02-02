const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');
const {validateToken , validateTokenAdmin} = require('../middlewares');
router.use(bodyParser.json());


router.get('/',validateToken, validateTokenAdmin,  (req, res)=>{
    db.authenticate().then(async ()=>{
    const querySQL = ` SELECT * FROM users`;
    const [resultados] = await db.query(querySQL, {raw:true});
    console.log(resultados)
        if(resultados.length == 0){
            res.status(202).send("No Content: There are no users");
            return;
        }
    res.send(resultados); 
    });
});

router.post('/', (req,res)=>{
    
    const body = req.body;
    const requiredKeys = ["username", "password", "fullname", "email", "address", "phone"];
    const editKeys = [];
    const errors= {empty:[],wrong:[], required: []};
     
     if(Object.keys(body).length == 0){
        res.status(400)
        res.send("Bad Request : The body is empty");
        return;

    }

    for (const key in body) {
        if(requiredKeys.includes(key) && body[key]){
            editKeys.push({[key] : body[key]})
        }else if(body[key] == ''){
            errors.empty.push(key)
        }else{
            errors.wrong.push(key)
        }
    }

    for(const key of requiredKeys){
        if(!body.hasOwnProperty(key)){
            errors.required.push(key)

        }
    }

    if (errors.wrong.length > 0 || errors.empty.length > 0 || errors.required.length > 0 ) {
        let msg = '';
        if(errors.empty.length>0){
            msg = msg + `Bad Request - The fields are empty : ${errors.empty.join(', ')}\n`; 
        }
        else if(errors.wrong.length>0){
            msg = msg + `Bad Request - The fields are wrong : ${errors.wrong.join(', ')}`;
        }
        else if( errors.required.length >0){
            msg = msg+ `Bad Request - The following fields are required : ${errors.required.join(', ')}`;
        }
        res.status(400)
        res.send(msg)
        return;
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
        res.status(400).send(e.parent.sqlMessage)
    })
});

router.get('/:id', validateToken, validateTokenAdmin,(req,res)=>{
    db.authenticate().then(async ()=>{
        const id = req.params.id
        const querySQL = ` SELECT * FROM users WHERE id =${id}`;
        const [resultado] = await db.query(querySQL, {raw:true});
            if(resultado.length < 1){
                res.status(404)
                res.send("Not Found : The user doesn't exist.")
                return;
            }
        res.status(200)
        res.json({ OK: resultado});
        });
})


router.put('/:id', validateToken, validateTokenAdmin,(req,res)=>{
    const id = req.params.id; 
    const body = req.body;
    const userKeys = ["username", "password", "fullname", "email", "address", "phone"];
    const editKeys = [];
    const errors= {empty:[],wrong:[]};

    if(Object.keys(body).length == 0){
        res.status(400)
        res.send("Bad Request : The body is empty");
        return;

    }
    for (const key in body) {
        if(userKeys.includes(key) && body[key]){
            editKeys.push({[key] : body[key]})
        }else if(body[key] == ''){
            errors.empty.push(key)
        }else{
            errors.wrong.push(key)
        }
    }

    if (errors.wrong.length > 0 || errors.empty.length > 0) {
        let msg = '';
        if(errors.empty.length>0){
            msg = msg + `Bad Request - The fields are empty : ${errors.empty.join(', ')}\n`; 
        }
        if(errors.wrong.length>0){
            msg = msg + `Bad Request - The fields are wrong : ${errors.wrong.join(', ')}`;
        }
        res.status(400)
        res.send(msg)
        return;
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
        if(resultado.changedRows == 0){
            res.status(404)
            res.send("Not Found : The user doesn't exist.");
            return;
        } 
        console.log(resultado)
        res.send({status: 'Modified', user: req.body})  

    })  
})

router.delete('/:id', validateToken, validateTokenAdmin,(req,res)=>{
    db.authenticate().then(async ()=>{
        const id = req.params.id
        const querySQL = ` DELETE FROM users WHERE id =${id}`;
        const [resultado] = await db.query(querySQL, {raw:true});
        console.log(resultado)
        if(resultado.affectedRows == 0){
            res.status(404)
            res.send("Not Found : The user doesn't exist.")
            return;
        }
        res.send({status: 'Deleted', user: id});
        return;
        });
})

module.exports = router;