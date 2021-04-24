# Employee_Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

  ## Table of Contents

  * [Description](#description)
  * [Installation](#installation)
  * [Technologies-Used](#technologies-used)
  * [Usage](#usage)
  * [Walkthrough](#walkthrough)
  * [Questions](#questions)
  * [Contributions](#contributions)
  * [License](#license)

  ## Description

  The motivation for this projects was the desire to use MySQL in order to store information that can be created, read, updated, and deleted using the Inquirer npm package.

  The reason for creating this specific project was the need for an application that a business owner can use to view and manage the departments, roles, and employees in a company. This allows for better planning and organization of a business.

  One of the challenges faced while building this project was the need to use multiple queries in succession in order to perform some of the actions presented in inquirer. In order to overcome this, I had to be very careful in calling each query in the correct order, and then storing the response information globally within a function for later use in combination with the results of other queries to the database.

  ## Installation

  Clone this repo to your local machine, and run 'npm install' in your terminal in order to install the needed dependencies.

  ## Technologies-Used

  * [Node.js](https://nodejs.org/en/)
  * [MySQL](https://www.mysql.com/)
  * [Inquirer.js](https://www.npmjs.com/package/inquirer)
  * [console.table npm](https://www.npmjs.com/package/console.table)

  ## Usage
  1. In your terminal run 'node app.js' to get the application started.
  1. You will then be prompted what you would like to do.
        * You should see options to add a department, view all departments, add a role, remove a role, view all roles, add an employee, remove an employee, view all employees, view all employees by department, view all employees by manager, update an employee's role, update an employee's manager, or 'EXIT' the application.
  1. Simply answer the prompts that then appear in your terminal.

  ## Walkthrough

  ![Application walkthrough gif](media/employee_tracker.gif)

  ## Questions  

  If you have any questions you can reach me at martin7mondaca@gmail.com or via my GitHub [martinmondaca](https://github.com/martinmondaca)

  ## Contributions

  For any contributionns you can reach me at martin7mondaca@gmail.com or via my GitHub [martinmondaca](https://github.com/martinmondaca)

  ## License

  Licensed under [MIT](https://choosealicense.com/licenses/mit/) license.
