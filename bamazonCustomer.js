// npm packages
const inquirer = require('inquirer');
const mySql = require('mysql');
const Table = require('cli-table');

let resString = '';
let resJSON = '';

const columns = [
    'itemId',
    'productName',
    'departmentName',
    'price',
    'stockQuantity'
];

// establish connection to database
const connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    port: '3306',
    database: 'bamazon'
});

// check for succesful connection
connection.connect((err) => {
    if (err) {
        console.error(`error connecting:  ${err.stack}`);
        return;
    }
    console.log(`connected as id ${connection.threadId}`);
    displayTable();
});

// query data
const displayTable = () => {
    let query = 'SELECT * FROM products';
    connection.query(query, (err, res, fields) => {
        if (err) {
            console.error('error connecting to table');
            return
        };
        // converts to a string
        resString = JSON.stringify(res, null, 2);
        // converts to json
        resJSON = JSON.parse(resString);
        // testing
        let table = new Table({
            head: [
                'itemId',
                'productName',
                'departmentName',
                'price',
                'stockQuantity'
            	],
            colWidths:[25,25,25,25,25]
        });
     for (let i = 0; i < resJSON.length; i++) {
     		// create the new array
        	let newArr = new Array();
        	// add content to the table
        	table.push(newArr);
        	// adds content to the new array of the Nth row
        	for (let j = 0; j < columns.length; j++) {
        		newArr.push(resJSON[i][columns[j]]);
        	}
        }
        // display table in CLI
        console.log(table.toString());
        customerRequest();

    });
};

// customer requests
const customerRequest = () => {
	// ask customer for ID Input
	inquirer.prompt([
			{
				type:'input',
				name:'id',
				message:'What is the ID of the product you would like to purchase?',
				validate: (value) => {
					let valid = !isNaN(parseFloat(value));
					return valid || 'Please enter a number!';
				}
			},
			{
				type:'input',
				name:'quantity',
				message:'How many would you like to buy?',
				validate: (value) => {
					let valid = !isNaN(parseFloat(value));
					return valid || 'Please enter a number!';
				}
			}
		]).then((answer) => {
			checkQuantity(answer.id, answer.quantity);
		});
};

// check quantity
const checkQuantity = (id, quantity) => {
	let query = 'SELECT stockQuantity FROM products WHERE ?'
	connection.query(query,{
		itemId:id
	},
		(err,res,fields) => {
			if (err) {
            console.error('error connecting to table');
            return
        	}
        	let stockedJSON = JSON.stringify(res, null, 2);
        	let stockedParsed = JSON.parse(stockedJSON);
        	let stockedQuantity = stockedParsed[0].stockQuantity;
        	// check to see if quantity in DB is greater than user's request.
        	if(stockedQuantity >= quantity) {
        		let query = 'UPDATE products SET ? WHERE ?';
        		// update DB
        		connection.query(query,[
        				{
        					// subtract quantity in db from user's requested quantity
        					stockQuantity: stockedQuantity - quantity
        				},
        				{
        					//product id
        					itemId: id
        				}        				
        			],(err,res,fields) => {
        			promptBool = false;
        			displayTable();
        		});
        	} else {
        		console.log('insufficient quantity...');
        	}
		});
}