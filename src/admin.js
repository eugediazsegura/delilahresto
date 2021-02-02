const db = require('sequelize');
const sequelize = new db('mysql://root:1234@localhost:3306/delilah_resto');

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