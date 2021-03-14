DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(15, 2) NOT NULL,
    dept_id INT,
    FOREIGN KEY(dept_id) REFERENCES department(id),
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    FOREIGN KEY(role_id) REFERENCES roles(id),
    manager_id INT,
    FOREIGN KEY(manager_id) REFERENCES employee(id),
    PRIMARY KEY(id)
)