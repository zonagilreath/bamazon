const inquirer = require('inquirer');
const mysql = require('mysql');
const table = require('table');

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
    let sql = "\
        SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.department_name,\
        SUM(products.product_sales) AS product_sales, (product_sales - departments.over_head_costs) AS total_profit\
        FROM departments\
        LEFT JOIN products ON departments.department_name = products.department_name\
        GROUP BY departments.department_name\
        ORDER BY departments.department_id;\
    "
    con.query(
        sql,
        function(err, results){
            if (err) throw err;
            let data = [["ID", "Name", "Overhead", "Product Sales", "Total Profit"]];
            results.forEach(item => {
                data.push(
                    [
                        item.department_id,
                        item.department_name,
                        item.over_head_costs,
                        item.product_sales,
                        item.total_profit
                    ]
                );
            });
            console.log(table.table(data));
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