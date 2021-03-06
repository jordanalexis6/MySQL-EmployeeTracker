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

function lookUp(query) {
	return new Promise((resolve, reject) => {
		connection.query(query, function (error, results) {
			if (error) {
				reject(error);
			}
			resolve(results);
		});
	});
}

const questions = [
	{
		type: "list",
		name: "actionChoice",
		message: "What would you like to do?",
		choices: ["UPDATE EMPLOYEE ROLE", "ADD", "VIEW"],
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

// if response is addChoice run through function to add based on what they choose
function init() {
	inquirer
		.prompt(questions)
		.then((response) => {
			if (response.actionChoice === "UPDATE EMPLOYEE ROLE") {
				//display current employee table
				console.table("./seed.sql");
				update();
			} else {
				inquirer.prompt(questions2).then((response2) => {
					switch (response.actionChoice) {
						case "ADD":
							if (response2.targetChoice === "employee") {
								employee();
							}
							if (response2.targetChoice === "role") {
								addRole();
							}
							if (response2.targetChoice === "department") {
								department();
							}
							break;
						case "VIEW":
							if (response2.targetChoice === "employee") {
								view(response2.targetChoice);
							}
							if (response2.targetChoice === "role") {
								view(response2.targetChoice);
							}
							if (response2.targetChoice === "department") {
								view(response2.targetChoice);
							}
							break;
						case "EXIT":
							connection.end();
							break;
						// code block
					}
				});
			}
		})
		.catch((error) => console.log(error));
}
// addChoice functions questions based on what they want to add
function employee() {
	lookUp("select id, title from role")
		.then((results) => {
			const roles = results.map((role) => {
				return role.id + ". " + role.title;
			});

			lookUp("select id, first_name, last_name from employee").then(
				(results) => {
					const employees = results.map((employee) => {
						return (
							employee.id +
							". " +
							employee.first_name +
							" " +
							employee.last_name
						);
					});

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
							type: "list",
							message: "What is your role id?",
							choices: roles,
						},
						{
							name: "manager_id",
							type: "list",
							message: "What is your manager id?",
							choices: employees,
						},
					];
					inquirer.prompt(employeeQuestions).then(function (answers) {
						// when finished prompting, insert a new item into the db with that info
						const role_id = answers.role_id.split(". ");
						const manager_id = answers.manager_id.split(". ");
						connection.query(
							"INSERT INTO employee SET ?",
							{
								first_name: answers.first_name,
								last_name: answers.last_name,
								role_id: role_id[0],
								manager_id: manager_id[0],
							},
							function (err) {
								if (err) throw err;
								// console.table();
								connection.end();
							}
						);
					});
				}
			);
		})
		.catch((error) => console.log(error));
}
function addRole() {
	lookUp("select id, name from department")
		.then((results) => {
			const departments = results.map((department) => {
				return department.id + ". " + department.name;
			});

			lookUp("select id, salary from role").then((results) => {
				const salaries = results.map((role) => {
					return role.id + ". " + role.salary;
				});

				const roleQuestions = [
					{
						name: "title",
						type: "input",
						message: "What is your role title?",
					},
					{
						name: "salary",
						type: "list",
						message: "What is your current salary",
						choices: salaries,
					},
					{
						name: "department_id",
						type: "list",
						message: "What is your department ID?",
						choices: departments,
					},
				];
				inquirer.prompt(roleQuestions).then(function (answers) {
					// when finished prompting, insert a new item into the db with that info
					// const role_id = answers.role_id.split(". ");
					const salary = answers.salary.split(". ");
					const department_id = answers.department_id.split(". ");
					connection.query(
						"INSERT INTO role SET ?",
						{
							title: answers.title,
							salary: salary[0],
							department_id: department_id[0],
						},
						function (err) {
							if (err) throw err;
							connection.end();
						}
					);
				});
			});
		})
		.catch((error) => console.log(error));
}
function department() {
	const departmentQuestions = [
		{
			name: "name",
			type: "input",
			message: "What is your department name?",
		},
	];
	inquirer
		.prompt(departmentQuestions)
		.then(function (answers) {
			// when finished prompting, insert a new item into the db with that info
			connection.query(
				"INSERT INTO department SET ?",
				{
					name: answers.name,
				},
				function (err) {
					if (err) throw err;
					// console.table();
					connection.end();
				}
			);
		})
		.catch((error) => console.log(error));
}

// if response is viewChoice
function view(response2) {
	// console.log(response);
	// inquirer.prompt(viewQuestions).then((response3) => {
	// console.log(response3);
	switch (response2) {
		case "employee":
			connection.query("SELECT * FROM employee limit 50", (err, results) => {
				if (err) throw err;

				console.log("Data received from Db:");
				console.table(results);
				connection.end();
			});
			break;
		case "role":
			connection.query("SELECT * FROM role limit 50", (err, results) => {
				if (err) throw err;

				console.log("Data received from Db:");
				console.table(results);
				connection.end();
			});
			break;
		case "department":
			connection.query("SELECT * FROM department limit 50", (err, results) => {
				if (err) throw err;

				console.log("Data received from Db:");
				console.table(results);
				connection.end();
			});
			break;
		case "EXIT":
			connection.end();
		default:
		// code block
	}
	// });
}
// if response is updateChoice
function update() {
	lookUp("select id, title, salary, department_id from role")
		.then((results) => {
			const role = results.map((role) => {
				// [{ name: "antonio", value: role}]
				return {
					name: `${role.id}. ${role.title} ${role.salary} ${role.department_id}`,
					value: role,
				};
			});
			const updateQuestions = [
				{
					type: "list",
					name: "update",
					message: "Which employee role would you like to update?",
					choices: role,
				},
			];
			inquirer.prompt(updateQuestions).then((answers) => {
				const role = answers.update;
				console.log(role);

				connection.query(
					"UPDATE role SET id = ?, title = ?, salary = ? where department_id = ?",
					role[0]
					// 	// ["Bobby", "Leipzig", 3],
					// 	(err, result) => {
					// 		if (err) throw err;
					// 		console.log(`Changed ${result.changedRows} row(s)`);
					// 	}
				);
			});
		})
		.catch((error) => console.log(error));
}
