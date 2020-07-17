var inquirer = require("inquirer");
var mysql = require("mysql");
const cTable = require("console.table");

// create the connection information for the sql database
var connection = mysql.createConnection({
	host: "localhost",

	// Your port; if not 3306
	PORT: process.env.PORT || 3306,

	// Your username
	user: "root",

	// Your password
	password: "password",
	database: "employee_DB",
});

// connect to the mysql server and sql database
connection.connect(function (err) {
	if (err) throw err;
	init();
});

const questions = [
	{
		type: "list",
		name: "actionChoice",
		message: "What would you like to do?",
		choices: ["ADD", "VIEW", "UPDATE"],
	},
];
const questions2 = [
	{
		type: "list",
		name: "targetChoice",
		message: "What would you like to target?",
		choices: ["employee", "role", "department"],
	},
];

const employeeQuestions = [
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
];
const roleQuestions = [
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
];
const departmentQuestions = [
	{
		name: "name",
		type: "input",
		message: "What is your department name?",
	},
];
//not MVP.
// const allQuestions = [employeeQuestions, roleQuestions, departmentQuestions];

// if response is addChoice run through function to add based on what they choose
function init() {
	inquirer.prompt(questions).then((response) => {
		if (response.actionChoice === "UPDATE") {
			role();
		} else {
			inquirer.prompt(questions2).then((response2) => {
				switch (response.actionChoice) {
					case "ADD":
						if (response2.targetChoice === "employee") {
							employee();
						}
						if (response2.targetChoice === "role") {
							role();
						}
						if (response2.targetChoice === "department") {
							department();
						}
						break;
					case "VIEW":
						if (response2.targetChoice === "employee") {
							employee();
						}
						if (response2.targetChoice === "role") {
							role();
						}
						if (response2.targetChoice === "department") {
							department();
						}
						break;
					// code block
				}
			});
		}
	});
}
// addChoice functions questions based on what they want to add
function employee() {
	//check if dept exists
	//check if role exists
	inquirer.prompt(employeeQuestions).then(function (answers) {
		// when finished prompting, insert a new item into the db with that info
		console.log(answers);
		connection.query(
			"INSERT INTO employee SET ?",
			{
				first_name: answers.first_name,
				last_name: answers.last_name,
				role_id: answers.role_id,
				manager_id: answers.manager_id,
			},
			function (err) {
				if (err) throw err;
				// console.table();
			}
		);
	});
}
function role() {
	inquirer.prompt(roleQuestions).then(function (answers) {
		// when finished prompting, insert a new item into the db with that info

		connection.query(
			"INSERT INTO role SET ?",
			{
				title: answers.title,
				salary: answers.salary,
				department_name: answers.department_name,
			},
			function (err) {
				if (err) throw err;
				// console.table();
			}
		);
	});
}
function department() {
	inquirer.prompt(departmentQuestions).then(function (answers) {
		// when finished prompting, insert a new item into the db with that info
		connection.query(
			"INSERT INTO department SET ?",
			{
				name: answers.name,
			},
			function (err) {
				if (err) throw err;
				// console.table();
			}
		);
	});
}

// if response is viewChoice
function view() {
	inquirer.prompt(questions).then((response) => {
		console.log(response);
		inquirer.prompt(viewQuestions).then((response3) => {
			console.log(response3);
			switch (response3.viewChoice) {
				case "employee":
					connection.query("SELECT * FROM employee limit 50", (err, rows) => {
						if (err) throw err;

						console.log("Data received from Db:");
						console.log(rows);
					});
					break;
				case "role":
					connection.query("SELECT * FROM role limit 50", (err, rows) => {
						if (err) throw err;

						console.log("Data received from Db:");
						console.log(rows);
					});
					break;
				case "department":
					connection.query("SELECT * FROM department limit 50", (err, rows) => {
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
// init();
// if response is updateChoice
function update() {
	inquirer.prompt(questions).then((response) => {
		console.log(response);
		inquirer.prompt(updateQuestions).then((response4) => {
			console.log(response4);
			switch (response4.updateChoice) {
				case "employee":
					connection.query(
						//----------------this is where the current problem is happening: Where id = ?    -------------------------
						"UPDATE employee SET first_name = ?, last_name = ? where id = ?",
						["Lil", "Leipzig", 3],
						(err, result) => {
							if (err) throw err;

							console.log(`Changed ${result.changedRows} row(s)`);
						}
					);
					break;
				case "role":
					connection.query(
						"UPDATE role SET title = ?, salary = ? where id = ?",
						["Bobby", "Leipzig", 3],
						(err, result) => {
							if (err) throw err;

							console.log(`Changed ${result.changedRows} row(s)`);
						}
					);
					break;
				case "department":
					connection.query(
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
// res.send(result.toString());

// Start our server so that it can begin listening to client requests.
// app.listen(PORT, function () {
// 	// Log (server-side) when our server has started
// 	console.log("Server listening on: http://localhost:" + PORT);
// });
