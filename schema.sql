DROP DATABASE IF EXISTS bamazon_db;
CREATE database bamazon;
USE bamazon;

CREATE TABLE products
(
    item_id INT(10)
    AUTO_INCREMENT NOT NULL,
    product_name VARCHAR
    (100) NOT NULL,
    department_name VARCHAR
    (100) NOT NULL,
    price DECIMAL
    (10,2) NOT NULL,
    stock_quantity INT
    (20) NOT NULL,
    PRIMARY KEY
    (item_id)
);
    Select *
    FROM products;

    INSERT INTO products
        (product_name, department_name, price, stock_quantity)
    VALUES
        ( "Lego", "Toys", 79.99, 20),
        ( "Barbie", "Toys", 99.99, 10),
        ( "Pillow", "Home", 29.99, 30),
        ( "Lipstick", "Beauty", 129.99, 14),
        ( "Perfume", "Beauty", 39.99, 15),
        ( "Nike", "Shoes", 89.99, 17),
        ( "Addidas", "Active", 19.99, 19),
        ( "Snikers", "Candy", 49.99, 11),
        ( "Winter-Boots", "Shoes", 69.99, 10),
        ( "Under-shirt", "Basics", 9.99, 19)