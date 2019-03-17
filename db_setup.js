const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'zona',
    password: 'Btg62824',
    database: 'bamazon'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    // var sql = "CREATE TABLE products (\
    //     item_id INT NOT NULL AUTO_INCREMENT,\
    //     product_name VARCHAR(255),\
    //     department_name VARCHAR(255),\
    //     price FLOAT(8),\
    //     stock_quantity INT,\
    //     PRIMARY KEY (item_id)\
    //     )";
    // connection.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table created");
    // });

    sql = "INSERT INTO products (product_name, department_name, price, stock_quantity) \
            VALUES \
            ('shirt', 'clothing', 10, 104), \
            ('The Water Knife', 'books', 15, 32),\
            ('cat food', 'pets', 8.99, 844),\
            ('The Uninhabitable Earth', 'books', 18.45, 1000),\
            ('Nintendo Switch', 'video games', 250, 200),\
            ('Hammer and Sickle Flag', 'home decor', 30, 2),\
            ('In The Grace of Your Love', 'music', 9.99, 400),\
            ('backpack', 'luggage', 39.99, 67),\
            ('water bottle', 'outdoors', 12.99, 324),\
            ('bluetooth mouse', 'electronics', 11.63, 70)"

    connection.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Rows Added");
    });
    connection.query('SELECT * FROM `products`', function (error, results) {
        if (err) throw err;
        console.log(results);
    });
});

// var mysql = require('mysql');

// var con = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "yourusername",
//   password: "yourpassword",
//   port: 2000
// });

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
//   con.query("CREATE DATABASE mydb", function (err, result) {
//     if (err) throw err;
//     console.log("Database created");
//   });
// });