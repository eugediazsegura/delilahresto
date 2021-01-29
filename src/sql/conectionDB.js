const Sequelize = require('sequelize');

const sequelize = new Sequelize('mysql://root:1234@localhost:3306/delilah_resto');

async function createTables(){
    let queries = [];
    queries.push(`CREATE TABLE IF NOT EXISTS delilah_resto.users (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        username VARCHAR (100) UNIQUE NOT NULL,
        password VARCHAR (100) NOT NULL,
        fullname VARCHAR (255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone BIGINT UNSIGNED DEFAULT NULL,
        admin TINYINT (1) NOT NULL DEFAULT '0'
      )  AUTO_INCREMENT=1 
      DEFAULT CHARSET=utf8mb4 
      COLLATE=utf8mb4_0900_ai_ci
    `);
    queries.push(`CREATE TABLE IF NOT EXISTS delilah_resto.products (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        name VARCHAR (255) UNIQUE NOT NULL,
        price DECIMAL (10,2) UNSIGNED NOT NULL,
        description VARCHAR (255),
        image VARCHAR(255) UNIQUE NOT NULL
      )  AUTO_INCREMENT=1 
      DEFAULT CHARSET=utf8mb4 
      COLLATE=utf8mb4_0900_ai_ci`);

    sequelize.authenticate().then(async ()=>{
        queries.forEach(async query=>{
            const [results] =  await sequelize.query(query, {raw:true});
            //console.log(results);
        })
    });
};



module.exports = sequelize;
module.exports.createTables = createTables;