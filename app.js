const inquirer = require('inquirer');
const mysql = require('mysql');

const con = mysql.createConnection({
    host: 'localhost',
    user: 'zona',
    password: '*nC,Jh&.RTks6%TpiKXvzqcx',
    database: 'bamazon'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Welcome to Bamazon!");
    init();

});

function updateQuantity(id, new_quant){
    sql_string = 'UPDATE products SET ? WHERE ?'
    con.query(sql_string, [{stock_quantity: new_quant}, {item_id: id}]);
}

function init(){
    con.query(
        "SELECT product_name, price, stock_quantity FROM products",
        function (err, results) {
            if (err) throw err;
            function choices(){
                let choices = [];
                results.forEach(item => {
                    string = `${item.product_name} for \$${item.price}, stock: ${item.stock_quantity}`;
                    choices.push(string);
                });
                return choices
            };

            const prompts = [
                {
                    name: 'selection',
                    type: 'list',
                    message: 'What would you like to buy?',
                    choices: choices(),
                    filter: function(choice) {
                        choice_array = choices();
                        return choice_array.indexOf(choice) + 1
                    }
                },
                {
                    name: 'quantity',
                    type: 'input',
                    message: `How many would you like?`
                }
            ];

            inquirer.prompt(prompts).then(response => {
                console.log(response);
                let id = response.selection;
                let order_quantity = response.quantity;
                let q_string = 'SELECT product_name, stock_quantity, price FROM products WHERE ?'
                con.query(q_string, [{item_id: id}], function(err, results){
                    if (err) throw err;
                    item = results[0];
                    if (item.stock_quantity >= order_quantity){
                        new_quant = item.stock_quantity - order_quantity;
                        updateQuantity(id, new_quant);
                        console.log(`
                        
                        YOU BOUGHT ${order_quantity} ${item.product_name}(s) for \$${item.price * order_quantity}
                        THANKS!
                        
                        `)
                        init();
                    }
                    else {
                        console.log(`
                        
                            I'm sorry, we don't have enough in stock to complete that order :(

                        `);
                        init();
                    }
                })
            });
        });

    // con.end();
}

