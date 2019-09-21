var mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '000000',
    database: 'chovaclub',
    dateStrings: true
});
db.connect(function (err, args) {
    console.log('DB Connect!')
});

module.exports = db;