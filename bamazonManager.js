// npm packages
const mysql = require('mysql');
const Table = require('cli-table');
const inquirer = require('inquirer');

let count = 0;
let columns = ['itemId', 'productName', 'departmentName', 'price', 'stockQuantity'];

// establish connection to mysql db
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'bamazon'
});

// check to see if connection was succesful
connection.connect((err) => {
    if (err) {
        console.error(`error connecting:  ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
    displayTable();
});

// query the data
const displayTable = () => {
    let query = 'SELECT * FROM products';
    connection.query(query, (err, res, fields) => {
        if (err) throw err;
        // testing
        let table = new Table({
            head: [
                'itemId',
                'productName',
                'departmentName',
                'price',
                'stockQuantity'
            ],
            colWidths: [25, 25, 25, 25, 25]
        });
        for (let i = 0; i < res.length; i++) {
            // creates a new array
            let newArr = new Array();
            // adds content to the table
            table.push(newArr);
            // adds content to new array of the Nth row
            for (let j = 0; j < columns.length; j++) {
                newArr.push(res[i][columns[j]]);
            }
        }
        // displays data to the terminal
        console.log(table.toString());
        customerRequest();
    });
}

// create a function that displays low inventory from database and displays it on a table

const displayLowInvTable = () => {
    let lowCount = 5;
    let query = `SELECT * FROM products WHERE stockQuantity <${lowCount}`;
    connection.query(query, (err, res, fields) => {
        if (err) throw err;
        // testing
        let table = new Table({
            head: [
                'itemId',
                'productName',
                'departmentName',
                'price',
                'stockQuantity'
            ],
            colWidths: [25, 25, 25, 25, 25]
        });
        for (let i = 0; i < res.length; i++) {
            let newArr = new Array();
            // adds content to table 
            table.push(newArr);
            // adds content to new array of the nth row
            for (let j = 0; j < columns.length; j++) {
                newArr.push(res[i][columns[j]]);
            }
        }
        // displays table in the terminal
        console.log(table.toString());
        customerRequest();
    });
}

// create a function that updates quantity of an item from database and displays it on a table

const updateQuantity = () => {
    inquirer.prompt([{
        type: 'input',
        name: 'product',
        message: 'What is the name of the product'
    }]).then((answer) => {
        let query = 'SELECT productName FROM products';
        let product = answer.product;
        connection.query(query, (err, res, fields) => {
            if (err) throw err;
            // checks to see if productName is valid
            for (let i = 0; i < res.length; i++) {
                if (res[i].productName === answer.product) {
                    // testing showing product name
                    count++;
                }
            }
            // if item exists
            if (count > 0) {
                // reset counter
                count = 0;
                // ask for the quantity the user would like to add
                inquier.prompt([{
                    type: 'input',
                    name: 'quantity',
                    message: 'How many would you like to add?'
                }]).then((answer)=>{
                	// get stock quantity from chosen product
                	let query = 'SELECT * FROM products WHERE ?';
                	let stockQty = 0;
                	let quantity = parseInt(answer.quantity);
                	connection.query(query,[{productName:product}],(err,res,fields) => {
                		stockQty = parseInt(res[0].stockQuantity);
                		// update db
                		console.log(`Stock Quantity: ${stockQty}`);
                		console.log(`Quantity: ${quantity}`);
                		console.log(`Stock Quantity: ${product}`);
                		let query = 'UPDATE products SET ? WHERE ?';
                		connection.query(query,[{stockQuantity: stockQty + quantity},{productName: product}],(err,res,fields)=>{
                			if(err) throw err;
                			console.log('Quantity Added!!!');
                			displayTable();
                		});
                	});
                });
            } else {
            	console.log('That item does not exist');
            	// ask for product name again
            	updateQuantity();
            }
        });
    });
}

// create a function that adds a new product to the database and displays it on a table

const addNewProduct = () => {
	inquirer.prompt([
			{
				type:'input',
				name:'product',
				message:'What is the product name?'
			},
			{
				type:'input',
				name:'department',
				message:'What is the department name?'
			},
			{
				type:'input',
				name:'price',
				message:'How much does it cost?'
			},
			{
				type:'input',
				name:'stockQty',
				message:'How many do you want to add?'
			}
		]).then((answer)=>{
			let product = answer.product;
			let department = answer.department;
			let price = answer.price;
			let stockQty = answer.stockQty;
			let post = {
				productName:product,
				departmentName:department,
				price:price,
				stockQuantity:stockQty
			}
			let query = 'INSERT INTO products SET ?';
			connection.query(query, post, (err, res, field) => {
				displayTable();
			});
		});
}

// create a function for customer requests, answers will be submitted via the inquirer package

const customerRequest = () => {
    // ask customer for id input
    inquirer.prompt([{
        type: 'rawlist',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
            'View Products for Sale',
            'View Low Inventory',
            'Add a New Product',
            'Add Quantity to Existing Item'
        ]
    }]).then((answer) => {
        switch (answer.choice) {
            case 'View Products for Sale':
                displayTable();
                break;
            case 'View Low Inventory':
                displayLowInvTable();
                break;
            case 'Add a New Product':
                addNewProduct();
                break;
            case 'Add Quantity to Existing Item':
                updateQuantity();
                break;

        }
    });
}