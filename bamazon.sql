-- create a db called 'bamazon' and switch into it for this project--
CREATE DATABASE bamazon;
USE bamazon;

-- create a table called 'products' which will contain the store inventory--
CREATE TABLE products (
	itemId INT(11) AUTO_INCREMENT NOT NULL,
	productName VARCHAR(30) NOT NULL,
	departmentName VARCHAR(20) NOT NULL,
	price DECIMAL(10,2) NOT NULL,
	stockQuantity INT(11) NOT NULL,
	PRIMARY KEY (itemId)
);

-- insert data into the 'products' table--
INSERT INTO products (productName, departmentName, price, stockQuantity)
VALUES 
('ACDelco Spark Plug', 'Automotive', 3.19, 300),
('Guild Wars 2: Path of Fire', 'Video Game', 64.95, 100),
('Gilette Razor', 'Skin Care', 4.50, 300),
('Apple Sauce', 'Grocery', 1.99, 750),
('Doggie Treats', 'Pet Supplies', 4.99, 300),
('Cat Nip', 'Pet Supplies', 4.99, 1300),
('Tropicana Orange Juice', 'Grocery', 2.50, 300),
('Turkey Hill Ice Cream', 'Grocery', 3.19, 300),
('Irish Spring Bar Soap', 'Hygene', 4.99, 300),
('Head&Shoulders', 'Hair Care', 7.99, 300),
('Continental Tires', 'Automotive', 175.00, 40),
('25 AAA Batteries', 'Electrical', 15.00, 300),
('1/4 inch socket set', 'Tools', 54.95, 300),
('HP Laptop', 'Electronics', 450.00, 300),
('Ticonderoga #2 Pencils', 'School/Office', 1.19, 300),
('Spiral College Ruled Notebook', 'School/Office', .99, 300),
('Protein ChocoShake', 'Health/Fitness', 24.95, 300),
('Mens Vitamin', 'Health/Fitness', 5.99, 300),
('Womens Vitamin', 'Health/Fitness', 5.99, 300),
('$500 Gift Card', 'Gifts', 500.00, 300);
