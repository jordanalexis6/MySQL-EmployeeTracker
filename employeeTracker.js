var mysql = require("mysql");
var inquirer = require("inquirer");
const cTable = require("console.table");
const questions = [
  {
    type: "list",
    name: "firstChoice",
    message: "What would you like to do?",
    choices: ["ADD", "VIEW", "UPDATE"],
  },
];
const addQuestions = [
  {
    type: "list",
    name: "addChoice",
    message: "What would you like to do?",
    choices: ["employee", "role", "department"],
  },
];
const viewQuestions = [
  {
    type: "list",
    name: "viewChoice",
    message: "What would you like to view?",
    choices: ["employee", "role", "department"],
  },
];
const updateQuestions = [
  {
    type: "list",
    name: "updateChoice",
    message: "What role would you like to update?",
    choices: ["employee", "role", "department"],
  },
];
// if response is addChoice run through function to add based on what they choose
function init() {
  inquirer.prompt(questions).then((response) => {
    console.log(response);
    inquirer.prompt(addQuestions).then((response2) => {
      console.log(response2);
      switch (response2.addChoice) {
        case "employee":
          employee();
          break;
        case "role":
          role();
          break;
        case "department":
          department();
          break;
        default:
        // code block
      }
    });
  });
}
init();
// addChoice functions questions based on what they want to add
function employee() {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is your first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is your last name?",
      },
      {
        name: "role_id",
        type: "input",
        message: "What is your role id?",
      },
      {
        name: "manager_id",
        type: "input",
        message: "What is your manager id?",
      },
    ])
    .then(function (response2) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO employee SET ?",
        {
          name: response2.employee,
        },
        function (err) {
          if (err) throw err;
          // console.table();
        }
      );
    });
}
function role() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is your role title?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is your current salary",
      },
      {
        name: "department_id",
        type: "input",
        message: "What is your department ID?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO role SET ?",
        {
          name: answer.role,
        },
        function (err) {
          if (err) throw err;
          // console.table();
        }
      );
    });
}
function department() {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is your department name?",
      },
    ])
    .then(function (answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO department SET ?",
        {
          name: answer.department,
        },
        function (err) {
          if (err) throw err;
          // console.table();
        }
      );
    });
}
// if response is viewChoice
function init() {
  inquirer.prompt(questions).then((response) => {
    console.log(response);
    inquirer.prompt(viewQuestions).then((response3) => {
      console.log(response3);
      switch (response3.viewChoice) {
        case "employee":
          con.query("SELECT * FROM employee limit 50", (err, rows) => {
            if (err) throw err;

            console.log("Data received from Db:");
            console.log(rows);
          });
          break;
        case "role":
          con.query("SELECT * FROM role limit 50", (err, rows) => {
            if (err) throw err;

            console.log("Data received from Db:");
            console.log(rows);
          });
          break;
        case "department":
          con.query("SELECT * FROM department limit 50", (err, rows) => {
            if (err) throw err;

            console.log("Data received from Db:");
            console.log(rows);
          });
          break;
        default:
        // code block
      }
    });
  });
}
init();
// if response is updateChoice
function init() {
  inquirer.prompt(questions).then((response) => {
    console.log(response);
    inquirer.prompt(updateQuestions).then((response4) => {
      console.log(response4);
      switch (response4.updateChoice) {
        case "employee":
          con.query(
            "UPDATE employee SET first_name = ?, last_name = ? Where id = ?",
            ["Leipzig", 3],
            (err, result) => {
              if (err) throw err;

              console.log(`Changed ${result.changedRows} row(s)`);
            }
          );
          break;
        case "role":
          con.query(
            "UPDATE role SET title = ?, salary = ? Where id = ?",
            ["Leipzig", 3],
            (err, result) => {
              if (err) throw err;

              console.log(`Changed ${result.changedRows} row(s)`);
            }
          );
          break;
        case "department":
          con.query(
            "UPDATE department SET name = ? Where id = ?",
            ["Leipzig", 3],
            (err, result) => {
              if (err) throw err;

              console.log(`Changed ${result.changedRows} row(s)`);
            }
          );
          break;
        default:
        // code block
      }
    });
  });
}
init();
