const jwt = require('jsonwebtoken');
const secreto = 'supEr5ecret4JWT';

function validateToken(req, res, next){
    try {
        const token = req.headers.authorization.split(' ')[1];
        const verificarToken = jwt.verify(token, secreto);
        if (verificarToken) {
            req.usuario = verificarToken;
            next();            
        }
    } catch (err) {
        res.json({ error: "Error al validar usuario"})
    }
}

module.exports= validateToken;
