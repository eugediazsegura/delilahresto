const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secreto = 'supEr5ecret4JWT';



function checkToken(req,res){
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verificarToken = jwt.verify(token, secreto);
        return verificarToken;
    } catch (err) {
        return null;
    }
    
}

function validateToken(req, res, next){
   const verificarToken = checkToken(req, res)
    if (verificarToken) {
        req.usuario = verificarToken;
        next();            
    } else{
        return res.status(401).send({Error: "Token is invalid"});
    }
}
    function validateUserID(req,res,next) {
        bodyParser.json()
        const verificarToken = checkToken(req, res)
        const body = req.body;
        if(req.usuario.admin == 1){
            return next(); // el usuario admin, tiene autorizacion sobre todo, se salta la logica de comprobacion de id. 
        }
        if(req.params.id){
            if (verificarToken.id ==req.params.id) {
                return next()
            }else{
                res.status(403)
                res.json({ Forbidden: "You don't have permissions for this request"})
                return;
            }
        }else if(verificarToken.id == body.id_user){
            return next();     
        }else{
            res.status(403)
            res.json({ Forbidden: "You don't have permissions for this request"})
            return;
        }
    
    } 

 function validateTokenAdmin(req,res,next) {
     
    const verificarToken = checkToken(req, res)
    if(verificarToken.admin == 1){
        next();     
    }else{
        res.status(403)
        res.json({ Forbidden: "You don't have administrator permissions for this request"})
    }
  
} 


module.exports.validateToken= validateToken;
module.exports.validateUserID= validateUserID;
module.exports.validateTokenAdmin = validateTokenAdmin;
