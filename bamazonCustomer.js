var mysql = require("mysql"); // pop quiz // schema // seeds sql required
var inquirer = require("inquirer");
var keys = require("./keys.js");
console.log(keys);

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: keys.password.secret,
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  makeTable();
});

var makeTable = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    console.table(res);
    // if (err) throw err;
    // for (var i = 0; i < res.length; i++) {
    //   console.log(
    //     // res[i].item_id +
    //     //   " ||" +
    //     //   res[i].product_name +
    //     //   " ||" +
    //     //   res[i].department_name +
    //     //   " ||" +
    //     //   res[i].price +
    //     //   " ||" +
    //     //   res[i].stock_quantity +
    //     //   "\n"
    //   );
    // }
    promptCustomer(res);
  });
};

var promptCustomer = function(res) {
  inquirer
    .prompt([
      {
        type: "input", // specific things , inquirer docs
        name: "choice", // anything
        message: "What would you like to buy today? [Quit with Q]"
      }
    ])
    .then(function(answer) {
      var correct = false;
      if (answer.choice.toUpperCase() == "Q") {
        process.exit();
      }
      for (var i = 0; i < res.length; i++) {
        if (res[i].product_name === answer.choice) {
          correct = true;
          var product = answer.choice;
          var id = i;
          inquirer
            .prompt({
              type: "input", // specific things , inquirer docs
              name: "quant", // anything
              message: "How many would you like to buy today?",
              validate: function(value) {
                if (isNaN(value) == false) {
                  return true;
                } else {
                  return false;
                }
              }
            })
            .then(function(answer) {
              if (res[id].stock_quantity - answer.quant > 0) {
                connection.query(
                  "UPDATE products SET stock_quantity='" +
                    (res[id].stock_quantity - answer.quant) +
                    "' WHERE product_name='" +
                    product +
                    "'",
                  function(err, res2) {
                    console.log("Product Bought!");
                    makeTable();
                  }
                );
              } else {
                console.log("NOT a valid Selection!");
                promptCustomer(res);
              }
            });
        }
      }
      if (i == res.length && correct == false) {
        console.log("Not a valid selection!");
        promptCustomer(res);
      }
    });
};
