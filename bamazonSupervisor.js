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
    console.log("Welcome to Bamazon Supervisor");
    init();
});

function viewDepartmentSales() {
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

function addDepartment() {
    let prompts = [
        {
            name: "department_name",
            type: "input",
            message: "What is the name of the department?",
        },
        {
            name: "over_head_costs",
            type: "input",
            message: "What are the overhead costs?",
            validate: function(value){
                return !(isNaN(value))
            }
        }
    ]
    inquirer.prompt(prompts).then(response => {
        con.query(
            "INSERT INTO departments SET ?",
            {
                department_name: response.department_name,
                over_head_costs: response.over_head_costs
            },
            function(err){
                if (err) throw err;
                console.log("\n");
                console.log("New Department Added");
                viewProducts();
                init();
            }
        );
    });
}

function init() {
    const choices = [
        "View Product Sales by Department",
        "Create New Department"
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
        let supervisorFunctions = [
            viewDepartmentSales,
            addDepartment
        ]
        choiceIndex = choices.indexOf(response.selection);
        supervisorFunctions[choiceIndex]();
    })
}