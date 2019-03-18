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
    console.log("Welcome to Bamazon Manager");
    init();
});

function viewProducts() {
    con.query(
        "SELECT product_name, price, stock_quantity FROM products",
        function(err, results){
            if (err) throw err;
            results.forEach(item => {
                string = `${item.product_name} for \$${item.price}, stock: ${item.stock_quantity}`;
                console.log(string);
            });
            init();
        }
    );
}

function lowInventory() {
    con.query(
        "SELECT product_name, price, stock_quantity FROM products WHERE stock_quantity < 50",
        function(err, results){
            if (err) throw err;
            console.log("\n");
            results.forEach(item => {
                string = `${item.product_name}, stock: ${item.stock_quantity}`;
                console.log(string);
            });
            console.log("\n");
            init();
        }
    );
}

function addInventory() {
    con.query(
        "SELECT product_name, stock_quantity FROM products",
        function (err, results) {
            if (err) throw err;
            let choices = [];
            results.forEach(item => {
                string = `${item.product_name}, stock: ${item.stock_quantity}`;
                choices.push(string);
            });;

            const prompts = [
                {
                    name: 'selection',
                    type: 'list',
                    message: 'Which item would you like to ',
                    choices: choices,
                    filter: function(choice) {
                        return choices.indexOf(choice) + 1
                    }
                },
                {
                    name: 'quantity_added',
                    type: 'input',
                    message: 'How many would you like to add?',
                    validate: value =>{
                        return !(isNaN(value))
                    }
                }
            ]
            inquirer.prompt(prompts).then(response => {
                let id = response.selection;
                con.query(
                    "SELECT stock_quantity FROM products WHERE ?",
                    {item_id: id},
                    (err, results) => {
                        if (err) throw err;
                        let current_stock = results[0].stock_quantity;
                        let new_quantity = parseInt(current_stock) + parseInt(response.quantity_added);
                        con.query(
                            "UPDATE products SET ? WHERE ?",
                            [{stock_quantity: new_quantity}, {item_id: id}]
                            );
                        console.log("\n");
                        console.log("Done!");
                        init();
                    }
                );
            });
        }
    );
}

function addProduct() {
    let prompts = [
        {
            name: "product_name",
            type: "input",
            message: "What is the name of the product?",
        },
        {
            name: "department_name",
            type: "input",
            message: "What department?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the unit price?",
            validate: function(value){
                return !(isNaN(value))
            }
        },
        {
            name: "stock_quantity",
            type: "input",
            message: "How many are in stock?",
            validate: value =>{
                return !(isNaN(value))
            }
        }
    ]
    inquirer.prompt(prompts).then(response => {
        con.query(
            "INSERT INTO products SET ?",
            {
                product_name: response.product_name,
                department_name: response.department_name,
                price: response.price,
                stock_quantity: response.stock_quantity
            },
            function(err){
                if (err) throw err;
                console.log("\n");
                console.log("New Item Added");
                viewProducts();
                init();
            }
        );
    });
}

function init() {
    const choices = [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
    ]
    const prompts = [
        {
            name: 'selection',
            type: 'list',
            message: 'What would you like to do?',
            choices: choices,
        }
    ]
    inquirer.prompt(prompts).then(response => {
        let managerFunctions = [
            viewProducts,
            lowInventory,
            addInventory,
            addProduct
        ]
        choiceIndex = choices.indexOf(response.selection);
        managerFunctions[choiceIndex]();
    })
}