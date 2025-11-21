const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',       
    password: 'admin',   
    database: 'shop'
});

db.connect(err => {
    if (err) console.log('DB 연결 실패:', err);
    else console.log('MySQL 연결 성공');
});

module.exports = db;
