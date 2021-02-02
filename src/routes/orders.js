const express = require('express');
const bodyParser = require('body-parser');
const router =  express.Router();
const db = require('../sql/conectionDB');
const execQueryArray = require('../sql/conectionDB').execQueryArray;
const moment = require('moment')
const {validateToken , validateTokenAdmin, validateUserID} = require('../middlewares');

router.use(bodyParser.json());

router.get('/', validateTokenAdmin, validateTokenAdmin, (req,res) =>{
    db.authenticate().then(async ()=>{
        const querySQL = ` SELECT o.id, u.fullname, os.label, pm.name,p.name,op.quantity, p.price, o.total, o.created_at
        FROM order_products op
        INNER JOIN orders o on o.id = op.id_order
        INNER JOIN users u on u.id = o.id_user
        INNER JOIN order_status os on os.id = o.id_order_status
        INNER JOIN payment_methods pm on pm.id = o.id_payment_method
        INNER JOIN products p on p.id = op.id_product 
        `;
        const [resultados] = await db.query(querySQL, {raw:true});
        console.log(resultados)
            if(resultados.length == 0){
                res.status(202).send("No Content: There are no users");
                return;
            }
        res.send(resultados); 
        });
})

router.post('/',validateToken, validateUserID, async (req, res) =>{  
    const body = req.body;
    const requiredKeys = ["id_user", "id_payment_method", "products"];
    const editKeys = [];
    const errors= {empty:[],wrong:[], required: [], notExist: []};
    let total = 0.0;
    let validatedProducts = []
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
   /*validar que en el body el cliente haya enviado un array de objetos con el campo id*/

   if (body.products && body.products.length > 0 && !validateErrors(errors)) {
       const products = body.products
       let validatedIDs = []
       for (const key in products) {
           if (products[key].hasOwnProperty('id')) {
               validatedIDs.push(products[key].id)
           }
       }

       /*validar que los ids enviados correspondan a productos existentes*/
       if (validatedIDs.length > 0) {
           await db.authenticate().then(async () => {
               const ids = validatedIDs.join(',')
               const querySQL = `SELECT * FROM products WHERE id in (${ids})`;
               const [resultado] = await db.query(querySQL, {
                   raw: true
               });
               if (resultado.length < 1) {
                   return;
               }
             
               // Simplifica los resultados para solo obtener el id;
               validatedProductsID = resultado.map(e => e.id); 
               // valido que los id que envio el cliente, existan en db, comparando con el resultado simplificado
               validatedProducts = validatedIDs.reduce((acc, el) => {
                   if (validatedProductsID.includes(el)) {
                       acc.push(el);
                   }
                   return acc;
               }, [])
               // cuento, los id repetidos para ponerlos en cantidad
               const repeated = validatedProducts.reduce((acc, element) => {
                   if (acc[element]) {
                       acc[element]++
                   } else {
                       acc[element] = 1
                   }
                   return acc;
               }, {})
               validatedProducts = repeated;
               resultado.map(e => { 
                   e.quantity = validatedProducts[e.id]
               })
               resultado.map(e => {
                total += parseFloat(e.price)*e.quantity
            })
               
            console.log(total)
               console.log(validatedProducts)
           })
       } else {
           errors.wrong.push("products")
       }
       await IDexistinDB(body.id_user, "users", errors);
       await IDexistinDB(body.id_payment_method, "payment_methods", errors)
}



   if (validateErrors(errors) || validatedProducts.length < 1 || typeof(validatedProducts) != "object") {
       let msg = '';
       if(errors.empty.length>0){
           msg = msg + `Bad Request - The fields are empty : ${errors.empty.join(', ')}\n`; 
       }
        if(errors.wrong.length>0){
           msg = msg + `Bad Request - The fields are wrong : ${errors.wrong.join(', ')}\n`;
       }
        if( errors.required.length >0){
           msg = msg+ `Bad Request - The following fields are required : ${errors.required.join(', ')}\n`;
       }
       if(errors.notExist.length >0) {
        msg = msg+ `Bad Request - The id of ${errors.notExist} doesn't exist\n`;
       }
        if(validatedProducts.length >0 || typeof(validatedProducts) != "Object"){
            msg = msg+"Not Found : The product doesn't exist or the syntax is not correct. ";
       }
       res.status(400)
       res.send(msg)
       return;
   }

   let now = moment().format('YYYY-MM-DD HH:mm:ss');
   let id_order = 0;

    let queries = []
    queries.push(`
       INSERT INTO orders (id_user, id_order_status, id_payment_method, total, created_at)
        VALUES(${body.id_user}, 1, ${body.id_payment_method}, "${total}", "${now}" );
       `);
    let results =await execQueryArray(queries);
    if(results.length > 0){   
       id_order =results[0];
       queriesProduct = [];
       for (const id_product in validatedProducts) {
            const quantity = validatedProducts[id_product];
            queriesProduct.push(`
            INSERT INTO order_products (id_order, id_product, quantity)
            VALUES(${id_order}, ${id_product}, ${quantity} );`)   
       }
       console.log(queriesProduct)
       let resultsProducts;
       try {
           resultsProducts =await execQueryArray(queriesProduct);
           
       } catch (e) {
          res.send({error: e}) 
          return;
       }

       console.log(resultsProducts)
       res.status(201);
       res.send({status: 'Created', order: results});
    }
})

router.get('/:id', validateToken, validateTokenAdmin,(req,res)=>{
    db.authenticate().then(async ()=>{
        const id = req.params.id
        const querySQL = `SELECT o.id, u.fullname, os.label, pm.name,p.name,op.quantity, p.price * op.quantity, o.total, o.created_at
        FROM order_products op
        INNER JOIN orders o on o.id = op.id_order
        INNER JOIN users u on u.id = o.id_user
        INNER JOIN order_status os on os.id = o.id_order_status
        INNER JOIN payment_methods pm on pm.id = o.id_payment_method
        INNER JOIN products p on p.id = op.id_product WHERE op.id_order =${id}`;
        const [resultado] = await db.query(querySQL, {raw:true});
            if(resultado.length < 1){
                res.status(404)
                res.send("Not Found : The order doesn't exist.")
                return;
            }
        res.status(200)
        res.json({ OK: resultado});
    });
})

router.put('/status/:id',validateToken,validateTokenAdmin,async (req, res) =>{ 
    const id = req.params.id; 
    const body = req.body;
    console.log(body)
    const requiredKey = "id_order_status";
    const errors= {empty:[],wrong:[], required: []};
    console.log(body[0])
    if(Object.keys(body).length == 0){
       res.status(400)
       res.send("Bad Request : The body is empty");
       return;
   }

    for (const key in body) {
        if(body[key] == ''){
            errors.empty.push(key)
        }else if(requiredKey != key){
            errors.wrong.push(key)
        }
    }

    if(!body.hasOwnProperty(requiredKey)){
        errors.required.push(requiredKey)

    }

   if (errors.wrong.length > 0 || errors.empty.length > 0 || errors.required.length > 0) {
       let msg = '';
       if(errors.empty.length>0){
           msg = msg + `Bad Request - The fields are empty : ${errors.empty.join(', ')}\n`; 
       }
        if(errors.wrong.length>0){
           msg = msg + `Bad Request - The fields are wrong : ${errors.wrong.join(', ')}\n`;
       }
        if( errors.required.length >0){
           msg = msg+ `Bad Request - The following fields are required : ${errors.required.join(', ')}\n`;
       }
       res.status(400)
       res.send(msg)
       return;
   }
   db.authenticate().then(async ()=>{

       let querySQL = `
       UPDATE orders
       SET id_order_status = ${body.id_order_status}
       WHERE id = ${id}`;
       const [resultado] = await db.query(querySQL, {raw:true});
       if(resultado.changedRows == 0){
           res.status(404)
           res.send("Not Found : The order doesn't modified.");
           return;
       } 
       console.log(resultado)
       res.send({status: 'Modified', order: req.body, id : id })  
   })
    
})
/*esta función comprueba si los ids existen en las tablas*/
router.delete('/:id', validateToken, validateTokenAdmin,(req,res)=>{
    const id = req.params.id
    db.authenticate().then(async ()=>{
        const querySQL = [] 
        querySQL.push(` DELETE FROM order_products WHERE id_order =${id}`);
        querySQL.push(` DELETE FROM orders WHERE id =${id}`);
        let results =await execQueryArray(querySQL);
        if(results.length < 1){
            res.status(404)
            res.send("Not Found : The order doesn't exist.")
            return;
        }
        res.send({status: 'Deleted', product: id});
        return;
        });
})
async function IDexistinDB(id, table, errors){
    await db.authenticate().then(async () => {
        const querySQL = ` SELECT * FROM ${table} WHERE id =${id}`;
        const [resultado] = await db.query(querySQL, { raw: true});
        if(resultado.length < 1){
            errors.notExist.push(table)
        }
        return resultado;
    })        
}

function validateErrors(errors){
    return errors.wrong.length > 0 || errors.empty.length > 0 || errors.required.length > 0 || errors.notExist.length > 0
}
module.exports = router;
