const mysql = require('mysql2');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'password',
  database: 'employee_tracker_db',
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the employee database.');

  // Call the function to start the application
  startEmployeeTracker();
});

// Function to start the employee tracker application
function startEmployeeTracker() {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Update employee manager',
        'View employees by manager',
        'View employees by department',
        'Delete an employee',
        'Delete a department',
        'Delete a role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;

        case 'View all roles':
          viewAllRoles();
          break;

        case 'View all employees':
          viewAllEmployees();
          break;

        case 'Add a department':
          addDepartment();
          break;

        case 'Add a role':
          addRole();
          break;

        case 'Add an employee':
          addEmployee();
          break;

        case 'Update an employee role':
          updateEmployeeRole();
          break;

          case 'Update employee manager':
            updateEmployeeManager();
          break;

        case 'View employees by manager':
          viewEmployeesByManager();
          break;

        case 'View employees by department':
          viewEmployeesByDepartment();
          break;

        case 'Delete an employee':
          deleteEmployee();
          break;

          case 'Delete a department':
          deleteDepartment();
          break;

        case 'Delete a role':
          deleteRole();
          break;

        case 'Exit':
          connection.end();
          break;

        default:
          console.log('Invalid option. Please try again.');
          startEmployeeTracker();
          break;
      }
    });
}

// Function to view all departments
function viewAllDepartments() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startEmployeeTracker();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    INNER JOIN department ON role.department_id = department.id
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startEmployeeTracker();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query = `
    SELECT
      e.id,
      e.first_name,
      e.last_name,
      role.title,
      department.name AS department,
      role.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    INNER JOIN role ON e.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startEmployeeTracker();
  });
}
