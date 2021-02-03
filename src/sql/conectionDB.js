const Sequelize = require('sequelize');
const config  = {
  DB_HOST:'127.0.0.1',
  DB_USER:'root',
  DB_PASS:'1234',
  DB_DATABASE:'delilah_resto'
}
const sequelize = new Sequelize(`mysql://${config.DB_USER}:${config.DB_PASS}@${config.DB_HOST}:3306/${config.DB_DATABASE}`);
const statusOrder = ["nuevo", "confirmado", "preparando", "enviando", "cancelado", "entregado"];
const statusOrderColor = ["#ef4a5a", "#fd6c3a", "#ffc641", "#30d694", "#afbef7", "#7d94a3"];
const methodOrders = ["Efectivo", "Visa", "Mastercard", "Naranja", "Santander", "Patagonia"]
const typeOrders = ["Contado", "Tarjeta de Crédito", "Tarjeta de Crédito", "Tarjeta de Crédito", "Tarjeta de Débito", "Tarjeta de Débito"]


async function createTables() {
  let queries = [];
  queries.push(`CREATE TABLE IF NOT EXISTS payment_methods (
      id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
      name VARCHAR (100) UNIQUE NOT NULL,
      type VARCHAR (100) NOT NULL
    )  AUTO_INCREMENT=1 
    DEFAULT CHARSET=utf8 
    COLLATE=utf8_general_ci
  `);
  queries.push(`CREATE TABLE IF NOT EXISTS order_status (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    label VARCHAR (100) UNIQUE NOT NULL,
    color VARCHAR (100) UNIQUE NOT NULL
  )  AUTO_INCREMENT=1 
  DEFAULT CHARSET=utf8 
  COLLATE=utf8_general_ci
`);
  queries.push(`CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        username VARCHAR (100) UNIQUE NOT NULL,
        password VARCHAR (100) NOT NULL,
        fullname VARCHAR (255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        address VARCHAR(255) NOT NULL,
        phone BIGINT UNSIGNED DEFAULT NULL,
        admin TINYINT (1) NOT NULL DEFAULT '0'
      )  AUTO_INCREMENT=1 
      DEFAULT CHARSET=utf8 
      COLLATE=utf8_general_ci
    `);
  queries.push(`CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        name VARCHAR (255) UNIQUE NOT NULL,
        price DECIMAL (10,2) UNSIGNED NOT NULL,
        description VARCHAR (255),
        image VARCHAR(255) UNIQUE NOT NULL
      )  AUTO_INCREMENT=1 
      DEFAULT CHARSET=utf8 
      COLLATE=utf8_general_ci`);
  queries.push(`CREATE TABLE IF NOT EXISTS orders (
        id INT auto_increment NOT NULL,
        id_user INT NOT NULL,
        id_order_status INT NOT NULL,
        id_payment_method INT NOT NULL,
        total DECIMAL (10,2) NOT NULL,
        created_at DATETIME NOT NULL,
        CONSTRAINT orders_PK PRIMARY KEY (id),
        CONSTRAINT orders_FK_1 FOREIGN KEY (id_user) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT orders_FK_2 FOREIGN KEY (id_order_status) REFERENCES order_status(id),
        CONSTRAINT orders_FK_3 FOREIGN KEY (id_payment_method) REFERENCES payment_methods(id)
      )
      DEFAULT CHARSET=utf8
      COLLATE=utf8_general_ci;`);
  queries.push(`CREATE TABLE IF NOT EXISTS order_products (
	    id_order INT NOT NULL,
      id_product INT NOT NULL,
      quantity INT NOT NULL DEFAULT '1',
      CONSTRAINT order_products_FK_1 FOREIGN KEY (id_order) REFERENCES orders(id),
      CONSTRAINT order_products_FK_2 FOREIGN KEY (id_product) REFERENCES products(id)
      )
      DEFAULT CHARSET=utf8
      COLLATE=utf8_general_ci;
`)

  execQueryArray(queries);
  await insertTables(methodOrders, typeOrders, "payment_methods", "name", "type")
  await insertTables(statusOrder, statusOrderColor, "order_status", "label", "color")
};



async function insertTables(arr1, arr2, table, column1, column2) {
  let queries = [];
  for (let i = 0; i < arr1.length; i++) {
    queries.push(`INSERT INTO ${table} (id, ${column1}, ${column2})` +
      ` VALUES(${i+1}, '${arr1[i]}', '${arr2[i]}') ON DUPLICATE KEY UPDATE ${column1}='${arr1[i]}', ${column2}='${arr2[i]}'`);
  }
  await execQueryArray(queries);
}

async function execQueryArray(queries) {
  let results = [];

  for (const query of queries) {
    await sequelize.authenticate().then(async () => {
      const [result] = await sequelize.query(query, {
        raw: true
      });
      results.push(result)
      //console.log(results);
    })
  }
  return results;
}




module.exports = sequelize;
module.exports.createTables = createTables;
module.exports.insertTables = insertTables;
module.exports.execQueryArray = execQueryArray