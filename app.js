const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'employee_tracker_db'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id" + connection.threadId);
    innit()
})

function innit() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "whatToDo",
                message: "What would you like to do?",
                choices: ["Add a department", "View all departments", "Add a role", "View all roles", "Add an employee",
                    "View all employees", "Update employee role"]
                // ["View All Employees", "View All Employees By Department", "View All Employees By Manager",
                //     "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager", "View All Roles",
                //     "Add Role", "Remove Role", "EXIT"]
            }
        ]).then((response) => {
            if (response.whatToDo === "Add a department") {
                console.log("adding dept")
                addDept()
            } else if (response.whatToDo === "View all departments") {

            } else if (response.whatToDo === "Add a role") {
                addRole()
            } else if (response.whatToDo === "View all roles") {

            } else if (response.whatToDo === "Add an employee") {
                addEmp()
            } else if (response.whatToDo === "View all employees") {

            } else if (response.whatToDo === "Update employee role") {

            } else {
                connection.end()
            }
        })
}
//prompts for adding a new department
function addDept() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "deptName",
                message: "What is the department's name?"
            }
        ]).then((answer) => {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    dept_name: answer.deptName,
                },
                function (err) {
                    if (err) throw err;
                    innit()
                }
            )
        })
}

//prompts for adding a new role
function addRole() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "roleTitle",
                message: "What is the role's title?"
            },
            {
                type: "input",
                name: "roleSalary",
                message: "What is the role's salary?"
            },
            {
                type: "input",
                name: "roleDeptId",
                message: "What is the role's department id?"
            }
        ]).then((answer) => {
            connection.query(
                "INSERT INTO roles SET ?",
                {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    department_id: answer.roleDeptId,
                },
                function (err) {
                    if (err) throw err;
                    innit()
                }
            )
        })
}

//prompts for adding new employee
function addEmp() {
    inquirer
        .prompt([
            {
                type: "input",
                name: "empFirstName",
                message: "What is the employee's first name?",
            }, {
                type: "input",
                name: "empLastName",
                message: "What is the employee's last name?",
            }, {
                type: "input",
                name: "empRole",
                message: "What is the employee's role id?",
            }, {
                type: "input",
                name: "empManager",
                message: "What is their manager's employee id?",
            }
        ]).then((answer) => {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.empFirstName,
                    last_name: answer.empLastName,
                    role_id: answer.empRole,
                    manager_id: answer.empManager,
                },
                function (err) {
                    if (err) throw err;
                    innit()
                }
            )
        })
}


connection.query(
    "SELECT"
)