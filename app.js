const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Kimberly#239776',
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
                choices: ["Add a department", "View all departments", "Add a role", "Remove a role", "View all roles", "Add an employee", "Remove an employee",
                    "View all employees", "View all employees by department", "View all employees by manager", "Update employee role", "Update employee manager", "EXIT"]
            }
        ]).then((response) => {
            if (response.whatToDo === "Add a department") {
                addDept()
            } else if (response.whatToDo === "View all departments") {
                viewAllDept()
            } else if (response.whatToDo === "Add a role") {
                addRole()
            } else if (response.whatToDo === "View all roles") {
                viewAllRoles()
            } else if (response.whatToDo === "Add an employee") {
                addEmp()
            } else if (response.whatToDo === "Remove an employee") {
                removeEmp()
            } else if (response.whatToDo === "View all employees") {
                viewAllEmp()
            } else if (response.whatToDo === "Update employee role") {
                updateEmpRole()
            } else if (response.whatToDo === "Update employee manager") {
                updateEmpManager()
            } else if (response.whatToDo === "View all employees by department") {
                viewAllEmpDept()
            } else if (response.whatToDo === "View all employees by manager") {
                viewAllEmpByManager()
            } else if (response.whatToDo === "Remove a role") {
                removeRole()
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
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO department SET ?",
                {
                    dept_name: answer.deptName,
                },
                function (err) {
                    if (err) throw err;
                    console.log("The department was added successfully!")
                    innit()
                }
            )
        })
}

//prompt for viewing all departments
function viewAllDept() {
    const query = `
    SELECT dept_name as department
    FROM department`
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("")
        console.table(res)
        console.log("")
        innit()
    })
}

//prompts for adding a new role
function addRole() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
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
                    type: "list",
                    name: "roleDeptName",
                    message: "What is the role's department?",
                    choices: function () {
                        let deptArray = [];
                        for (let i = 0; i < res.length; i++) {
                            deptArray.push(res[i].dept_name);
                        }
                        return deptArray;
                    }
                }
            ]).then(function (answer) {
                var chosenDept = res.find(item => item.dept_name === answer.roleDeptName)
                connection.query(
                    "INSERT INTO roles SET ?",
                    {
                        title: answer.roleTitle,
                        salary: parseInt(answer.roleSalary),
                        dept_id: parseInt(chosenDept.id)
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(`The ${answer.roleTitle} role was addedd successfully!`)
                        innit()
                    }
                )
            })
    })
}

//prompt for viewing all roles
function viewAllRoles() {
    const query = `
    SELECT r.title, r.salary, d.dept_name AS department 
    FROM roles r 
    LEFT JOIN department d 
    ON r.dept_id = d.id`
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("")
        console.table(res)
        console.log("")
        innit()
    })
}

//prompt for removing a role
function removeRole() {
    connection.query("SELECT * FROM roles", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "removeRole",
                    message: "Which role would you like to remove?",
                    choices: function () {
                        let roleArray = [];
                        for (let i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        return roleArray;
                    }
                }
            ]).then((answer) => {
                var chosenRole = res.find(item => item.title === answer.removeRole)
                connection.query("DELETE FROM roles WHERE ?",
                    {
                        id: chosenRole.id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(`${answer.removeRole} role is now removed!`)
                        innit()
                    }
                )
            })
    })
}

//prompts for adding new employee
function addEmp() {
    let newEmpFirst;
    let newEmpLast;
    let newEmpRole;
    let newEmpManager;

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
            },
        ]).then((answer) => {
            newEmpFirst = answer.empFirstName;
            newEmpLast = answer.empLastName;
            connection.query("SELECT * FROM roles", function (err, res) {
                if (err) throw err;
                inquirer
                    .prompt([
                        {
                            type: "list",
                            name: "empRole",
                            message: "What is the employee's role?",
                            choices: function () {
                                let roleArray = [];
                                for (let i = 0; i < res.length; i++) {
                                    roleArray.push(res[i].title);
                                }
                                return roleArray;
                            }
                        }
                    ]).then((answer) => {
                        var chosenRole = res.find(item => item.title === answer.empRole);
                        newEmpRole = chosenRole.id;
                        connection.query("SELECT * FROM employee", function (err, res) {
                            if (err) throw err;
                            inquirer
                                .prompt([
                                    {
                                        type: "list",
                                        name: "empManager",
                                        message: "Who is the employee's manager?",
                                        choices: function () {
                                            let managerArray = [];
                                            for (let i = 0; i < res.length; i++) {
                                                managerArray.push(res[i].first_name + " " + res[i].last_name);
                                            }
                                            return managerArray;
                                        }
                                    }
                                ]).then((answer) => {
                                    var chosenManager = res.find(item => (item.first_name + " " + item.last_name) === answer.empManager);
                                    newEmpManager = chosenManager.id;
                                    connection.query(
                                        "INSERT INTO employee SET ?",
                                        {
                                            first_name: newEmpFirst,
                                            last_name: newEmpLast,
                                            role_id: parseInt(newEmpRole),
                                            manager_id: parseInt(newEmpManager)
                                        },
                                        function (err) {
                                            if (err) throw err;
                                            console.log(`New employee, ${newEmpFirst} ${newEmpLast}, has been successfully added!`)
                                            innit()
                                        }
                                    )
                                })
                        })
                    })
            })
        })
}

//prompt for removing an employee
function removeEmp() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "removeEmp",
                    message: "Which employee would you like to remove?",
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < res.length; i++) {
                            empArray.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return empArray;
                    }
                }
            ]).then((answer) => {
                var chosenEmp = res.find(item => (item.first_name + " " + item.last_name) === answer.removeEmp)
                connection.query("DELETE FROM employee WHERE ?",
                    {
                        id: chosenEmp.id
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log(`${answer.removeEmp} is now removed!`)
                        innit()
                    }
                )
            })
    })
}

//prompt for viewing all employees
function viewAllEmp() {
    const query = `
    SELECT e.first_name AS "First name", e.last_name AS "Last name", r.title AS Role, r.salary AS Salary, 
    CONCAT(em.first_name, " ", em.last_name) AS "Manager name"
    FROM employee e
    LEFT JOIN 
    roles r
    ON r.id = e.role_id
    LEFT JOIN employee em
    ON e.manager_id = em.id
    `
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.log("")
        console.table(res)
        console.log("")
        innit()
    })
}

//promp for viewing all employees by department
function viewAllEmpDept() {
    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "deptName",
                    message: "Which department's employees would you like to view?",
                    choices: function () {
                        let deptArray = [];
                        for (let i = 0; i < res.length; i++) {
                            deptArray.push(res[i].dept_name);
                        }
                        return deptArray;
                    }
                }
            ]).then((answer) => {
                var chosenDept = res.find(item => item.dept_name === answer.deptName);
                query = `
                SELECT e.first_name AS "First name", e.last_name AS "Last name", r.title AS Title, r.salary AS Salary, d.dept_name AS Department
                FROM employee e
                LEFT JOIN
                (roles r
                LEFT JOIN department d
                ON d.id = r.dept_id)
                ON e.role_id = r.id
                WHERE ?`
                connection.query(query,
                    {
                        dept_id: chosenDept.id
                    }, function (err, res) {
                        if (err) throw err;
                        console.log("")
                        console.table(res)
                        console.log("")
                        innit()
                    })
            })
    })
}

//prompt to view all employees by manager
function viewAllEmpByManager() {
    connection.query("SELECT e.id, e.first_name, e.last_name FROM employee e LEFT JOIN roles r ON e.role_id = r.id WHERE title = 'Manager' OR 'manager'", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "managerName",
                    message: "Which manager's employees would you like to view?",
                    choices: function () {
                        let managerArray = [];
                        for (let i = 0; i < res.length; i++) {
                            managerArray.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return managerArray;
                    }
                }
            ]).then((answer) => {
                var chosenManager = res.find(item => (item.first_name + " " + item.last_name) === answer.managerName);
                query = `
                 SELECT e.first_name AS "First name", e.last_name AS "Last name", r.title AS Title, r.salary AS Salary, d.dept_name AS Department
                 FROM employee e
                 LEFT JOIN
                 (roles r
                 LEFT JOIN department d
                 ON d.id = r.dept_id)
                 ON e.role_id = r.id
                 WHERE ?`
                connection.query(query,
                    {
                        manager_id: chosenManager.id
                    }, function (err, res) {
                        if (err) throw err;
                        console.log("")
                        console.table(res)
                        console.log("")
                        innit()
                    })
            })
    })
}

//prompt to update employee's role
function updateEmpRole() {
    let empName;
    let empToUpdate;
    let empRoleUpdate;
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "empName",
                    message: "Which employee would you like to update?",
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < res.length; i++) {
                            empArray.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return empArray;
                    }
                }
            ]).then((answer) => {
                var chosenEmp = res.find(item => (item.first_name + " " + item.last_name) === answer.empName);
                empToUpdate = chosenEmp.id;
                empName = answer.empName;
                connection.query("SELECT * FROM roles", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                name: "newRole",
                                message: "What is the employee's new role?",
                                choices: function () {
                                    let roleArray = [];
                                    for (let i = 0; i < res.length; i++) {
                                        roleArray.push(res[i].title);
                                    }
                                    return roleArray;
                                }
                            }

                        ]).then((answer) => {
                            var chosenRole = res.find(item => item.title === answer.newRole)
                            empRoleUpdate = chosenRole.id
                            connection.query(
                                "UPDATE employee SET ? WHERE ?",
                                [
                                    { role_id: parseInt(empRoleUpdate) },
                                    { id: parseInt(empToUpdate) }
                                ],
                                function (err) {
                                    if (err) throw err;
                                    console.log(`${empName}'s role is now updated!`)
                                    innit()
                                }
                            )
                        })
                })
            })
    })
}

//prompt for updating employee manager
function updateEmpManager() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "empName",
                    message: "Which employee would you like to update?",
                    choices: function () {
                        let empArray = [];
                        for (let i = 0; i < res.length; i++) {
                            empArray.push(res[i].first_name + " " + res[i].last_name);
                        }
                        return empArray;
                    }
                }
            ]).then((answer) => {
                var chosenEmp = res.find(item => (item.first_name + " " + item.last_name) === answer.empName);
                connection.query("SELECT e.id, e.first_name, e.last_name FROM employee e LEFT JOIN roles r ON e.role_id = r.id WHERE title = 'Manager' OR 'manager'", function (err, res) {
                    if (err) throw err;
                    inquirer
                        .prompt([
                            {
                                type: "list",
                                name: "managerName",
                                message: "Who is the employee's new manager?",
                                choices: function () {
                                    let managerArray = [];
                                    for (let i = 0; i < res.length; i++) {
                                        managerArray.push(res[i].first_name + " " + res[i].last_name);
                                    }
                                    return managerArray
                                }
                            }
                        ]).then((answer) => {
                            var chosenManager = res.find(item => (item.first_name + " " + item.last_name) === answer.managerName);
                            connection.query("UPDATE employee SET ? WHERE ?",
                                [
                                    { manager_id: chosenManager.id },
                                    { id: chosenEmp.id }
                                ],
                                function (err) {
                                    if (err) throw err;
                                    console.log(`${chosenEmp.first_name} ${chosenEmp.last_name}'s manager has been updated!`)
                                    innit()
                                })
                        })
                })
            })
    })
}