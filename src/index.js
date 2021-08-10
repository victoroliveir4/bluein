const express = require('express');
//const mysql = require('mysql');

const PORT = 3000;
const HOST = '0.0.0.0';

const app = express();

/*const connection = mysql.createConnection({
    host: 'mysql-container',
    user: 'root',
    password: 'bluein',
    database: 'bluein'
});

connection.connect();*/

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, HOST);