var mysql = require("mysql");
var inquirer = require("inquirer");
// var keys = require("./keys.js");
// console.log(keys);

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Invalid@123",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayMenu();
});
// display menu for selection
function displayMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Menu",
        message: "Choose your option from the below menu???",
        choices: [
          "a: View Products for Sale",
          "b: View Low Inventory",
          "c: Add to Inventory",
          "d: Add New Product",
          "e: Exit"
        ]
      }
    ])
    .then(function(choice) {
      switch (choice.Menu) {
        case "a: View Products for Sale":
          viewProductsForSale();
          break;
        case "b: View Low Inventory":
          viewLowInventory();
          break;
        case "c: Add to Inventory":
          addToInventory();
          break;
        case "d: Add New Product":
          addNewProduct();
          break;
        case "e: Exit":
          console.log("Thank-you!");
          break;
      }
    });
}
// view all products availale for sale
var viewProductsForSale = function() {
  var displayProducts = connection.query(
    "SELECT * FROM products",
    displayProducts,
    function(err, res) {
      // if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        console.log(
          "\n" +
            res[i].item_id +
            " ||" +
            res[i].product_name +
            " ||" +
            res[i].department_name +
            " ||" +
            res[i].price +
            " ||" +
            res[i].stock_quantity
          // +
          // "\n"
        );
      }
    }
  );
  displayMenu();
};

var viewLowInventory = function() {
  var query =
    "SELECT item_id, product_name, stock_quantity FROM products WHERE stock_quantity < 5";
  connection.query(query, function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(
        "\n" +
          "Product ID: " +
          res[i].item_id +
          " || Product Name: " +
          res[i].product_name +
          " || Quantity: " +
          res[i].stock_quantity
      );
    }
    console.log("Please add some more quantity!");
  });
  displayMenu();
};
//adds new product to inventory
function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "Enter the product you would like to add."
      },
      {
        type: "input",
        name: "department_name",
        message: "Enter department you would like to add this product to."
      },
      {
        type: "input",
        name: "price",
        message: "Enter the price of the product."
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "Enter the quantity of product."
      }
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      if (isNaN(answer.price) || isNaN(answer.stock_quantity)) {
        console.log("Invalid Input");
        if (isNaN(answer.price)) console.log("Invalid Price");
        if (isNaN(answer.stock_quantity)) console.log("Invalid Quantity");
        displayMenu();
      } else {
        var newrow = {
          product_name: answer.product_name,
          department_name: answer.department_name,
          price: answer.price,
          stock_quantity: answer.stock_quantity
        };
        var sql = "insert into products set ?";
        connection.query(sql, newrow, function(err, res) {
          if (err) {
            throw err;
          } else {
            console.log("New Product Added!");
          }
          displayMenu();
        });
      }
    });
}
// Adds new stock to selected product.
var addToInventory = function() {
  inquirer
    .prompt([
      {
        name: "product_ID",
        type: "input",
        message: "Enter product ID that you would like to add stock to."
      },
      {
        name: "stock",
        type: "input",
        message: "How much stock would you like to add?"
      }
    ])
    .then(function(answer) {
      // Pushes new stock to database.
      connection.query("SELECT * FROM products", function(err, results) {
        var chosenItem;

        // Gets product who's stock needs to be updated.
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id === parseInt(answer.product_ID)) {
            chosenItem = results[i];
          }
        }
        // Adds new stock  to existing stock.
        var updatedStock =
          parseInt(chosenItem.stock_quantity) + parseInt(answer.stock);

        console.log("Updated stock: " + updatedStock);

        // Updates stock for selected product in database.
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: updatedStock
            },
            {
              item_id: answer.product_ID
            }
          ],
          function(err, res) {
            if (err) {
              throw err;
            } else {
              console.log("Quantity Updated");
              displayMenu();
            }
          }
        );
      });
    });
};
