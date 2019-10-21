var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");
// console.log(keys);
var table = require("cli-table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: keys.password.secret,
  database: "bamazon_db"
});

displayshoplist();

function displayshoplist() {
  connection.query("SELECT * FROM products", function(error, response) {
    if (error) throw error;
    var displayTable = new table({
      head: ["Item ID", "Product Name", "Department", "Price", "Stock"],
      colWidths: [10, 30, 18, 10, 14]
    });
    for (i = 0; i < response.length; i++) {
      displayTable.push([
        response[i].item_id,
        response[i].product_name,
        response[i].department_name,
        response[i].price,
        response[i].stock_quantity
      ]);
    }
    console.log(displayTable.toString());
    promptCustomer();
  });
}
function promptCustomer() {
  inquirer
    .prompt([
      {
        name: "ID",
        type: "input",
        message: "Enter the item ID you like to buy."
      },
      {
        name: "Quantity",
        type: "input",
        message: "How many would you like to buy?"
      }
    ])
    .then(function(answers) {
      var quantityWanted = answers.Quantity;
      var idWanted = answers.ID;
      purchaseShopList(idWanted, quantityWanted);
    });
}
function purchaseShopList(ID, quantityNeeded) {
  connection.query("SELECT * FROM products WHERE item_id = " + ID, function(
    error,
    response
  ) {
    if (error) throw error;
    if (quantityNeeded <= response[0].stock_quantity) {
      var totalCost = response[0].price * quantityNeeded;
      console.log("Congratulations! your order is on the way!");
      console.log(
        "Your total cost for " +
          quantityNeeded +
          " " +
          response[0].product_name +
          " is " +
          totalCost +
          ". Thank you for shopping."
      );
      connection.query(
        "UPDATE products SET stock_quantity = stock_quantity - " +
          quantityNeeded +
          " WHERE item_id = " +
          ID
      );
    } else {
      console.log(
        "Sorry. We don't have enough " +
          response[0].product_name +
          " to fulfill your order."
      );
    }
    repeat();
  });
}
function repeat() {
  inquirer
    .prompt({
      name: "shop",
      type: "list",
      choices: ["Yes", "No"],
      message: "Would you like to continue shopping?"
    })
    .then(function(answer) {
      if (answer.shop == "Yes") {
        displayshoplist();
      } else {
        console.log("Thank you!");
        connection.end();
      }
    });
}
