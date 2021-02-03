const db = require('sequelize');
const config = {
    DB_HOST:'127.0.0.1',
    DB_USER:'root',
    DB_PASS:'1234',
    DB_DATABASE:'delilah_resto'
}

const sequelize = new db(`mysql://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:3306/${config.DB_DATABASE}`);

function createAdmin(){
    if(process.argv.length > 3){
        //console.log(process.argv[2], process.argv[3])
        const username = process.argv[2];
        const password = process.argv[3];
        sequelize.authenticate().then(()=>{
            sequelize.query(`INSERT INTO users (username,password,fullname ,email ,address,phone,admin)
                VALUES ('${username}','${password}','[ADMIN] ${username}', '${username}@delilah.resto', 'admin 999', 0, 1);`, { raw: true})
        })
    }else{
        console.error('Error: You must be pass 2 parameters: name and password.\nExample: npm run createAdmin juan 1234');
        return;
    }
}


module.exports = createAdmin();