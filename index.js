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
// Function to add a department
function addDepartment() {
  inquirer
    .prompt({
      name: 'name',
      type: 'input',
      message: 'Enter the name of the department:',
      validate: (input) => {
        if (input.trim() !== '') {
          return true;
        }
        return 'Please enter a valid department name.';
      },
    })
    .then((answer) => {
      const query = 'INSERT INTO department SET ?';
      connection.query(query, { name: answer.name }, (err, res) => {
        if (err) throw err;
        console.log(`\nDepartment '${answer.name}' added successfully.`);
        startEmployeeTracker();
      });
    });
}

// Function to add a role
function addRole() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: "Enter the role's title:",
          validate: (input) => {
            if (input.trim() !== '') {
              return true;
            }
            return 'Please enter a valid role title.';
          },
        },
        {
          name: 'salary',
          type: 'input',
          message: "Enter the role's salary:",
          validate: (input) => {
            if (/^\d+(\.\d{1,2})?$/.test(input)) {
              return true;
            }
            return 'Please enter a valid salary (numeric value).';
          },
        },
        {
          name: 'department',
          type: 'list',
          message: "Select the role's department:",
          choices: departments.map((dept) => ({
            name: dept.name,
            value: dept.id,
          })),
        },
      ])
      .then((answer) => {
        const role = {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.department,
        };

        const query = 'INSERT INTO role SET ?';
        connection.query(query, role, (err, res) => {
          if (err) throw err;
          console.log(`\nRole '${answer.title}' added successfully.`);
          startEmployeeTracker();
        });
      });
  });
}
// Function to add an employee
function addEmployee() {
  const query = `
    SELECT id, CONCAT(first_name, ' ', last_name) AS name
    FROM employee
  `;
  connection.query(query, (err, employees) => {
    if (err) throw err;

    const query = 'SELECT id, title FROM role';
    connection.query(query, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'first_name',
            type: 'input',
            message: "Enter the employee's first name:",
            validate: (input) => {
              if (input.trim() !== '') {
                return true;
              }
              return 'Please enter a valid first name.';
            },
          },
          {
            name: 'last_name',
            type: 'input',
            message: "Enter the employee's last name:",
            validate: (input) => {
              if (input.trim() !== '') {
                return true;
              }
              return 'Please enter a valid last name.';
            },
          },
          {
            name: 'role',
            type: 'list',
            message: "Select the employee's role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
          {
            name: 'manager',
            type: 'list',
            message: "Select the employee's manager:",
            choices: [
              { name: 'None', value: null },
              ...employees.map((employee) => ({
                name: employee.name,
                value: employee.id,
              })),
            ],
          },
        ])
        .then((answer) => {
          const employee = {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.role,
            manager_id: answer.manager,
          };

          const query = 'INSERT INTO employee SET ?';
          connection.query(query, employee, (err, res) => {
            if (err) throw err;
            console.log(`\nEmployee '${answer.first_name} ${answer.last_name}' added successfully.`);
            startEmployeeTracker();
          });
        });
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  const query = 'SELECT * FROM employee';
  connection.query(query, (err, employees) => {
    if (err) throw err;

    const query = 'SELECT * FROM role';
    connection.query(query, (err, roles) => {
      if (err) throw err;

      inquirer
        .prompt([
          {
            name: 'employee',
            type: 'list',
            message: "Select the employee you want to update:",
            choices: employees.map((employee) => ({
              name: `${employee.first_name} ${employee.last_name}`,
              value: employee.id,
            })),
          },
          {
            name: 'role',
            type: 'list',
            message: "Select the employee's new role:",
            choices: roles.map((role) => ({
              name: role.title,
              value: role.id,
            })),
          },
        ])
        .then((answer) => {
          const query = 'UPDATE employee SET role_id = ? WHERE id = ?';
          connection.query(query, [answer.role, answer.employee], (err, res) => {
            if (err) throw err;
            console.log(`\nEmployee's role updated successfully.`);
            startEmployeeTracker();
          });
        });
    });
  });
}
// Function to delete an employee
function deleteEmployee() {
  const query = 'SELECT * FROM employee';
  connection.query(query, (err, employees) => {
    if (err) throw err;

    inquirer
      .prompt({
        name: 'employee',
        type: 'list',
        message: "Select the employee you want to delete:",
        choices: employees.map((employee) => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id,
        })),
      })
      .then((answer) => {
        const query = 'DELETE FROM employee WHERE id = ?';
        connection.query(query, [answer.employee], (err, res) => {
          if (err) throw err;
          console.log(`\nEmployee deleted successfully.`);
          startEmployeeTracker();
        });
      });
  });
}
/// Function to delete a department
function deleteDepartment() {
  const query = 'SELECT * FROM department';
  connection.query(query, (err, departments) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'department',
          type: 'list',
          message: 'Select the department to delete:',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ])
      .then((answer) => {
            connection.query(
          'DELETE FROM role WHERE department_id = ?',
          [answer.department],
          (err, res) => {
            if (err) throw err;
            console.log('Roles associated with the department have been deleted.');
              connection.query(
              'DELETE FROM department WHERE id = ?',
              [answer.department],
              (err, res) => {
                if (err) throw err;
                console.log('Department deleted successfully.');
                startEmployeeTracker();
              }
            );
          }
        );
      });
  });
}
// Function to delete a role
function deleteRole() {
  const query = 'SELECT * FROM role';
  connection.query(query, (err, roles) => {
    if (err) throw err;

    inquirer
      .prompt({
        name: 'role',
        type: 'list',
        message: "Select the role you want to delete:",
        choices: roles.map((role) => ({
          name: role.title,
          value: role.id,
        })),
      })
      .then((answer) => {
        const query = 'DELETE FROM role WHERE id = ?';
        connection.query(query, [answer.role], (err, res) => {
          if (err) throw err;
          console.log(`\nRole deleted successfully.`);
          startEmployeeTracker();
        });
      });
  });
}
// Function to update an employee's manager
function updateEmployeeManager() {
  const query = 'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee';
  connection.query(query, (err, employees) => {
    if (err) throw err;

    inquirer
      .prompt([
        {
          name: 'employee',
          type: 'list',
          message: 'Select the employee to update:',
          choices: employees.map((employee) => ({
            name: employee.name,
            value: employee.id,
          })),
        },
        {
          name: 'manager',
          type: 'list',
          message: "Select the employee's new manager:",
          choices: [
            { name: 'None', value: null },
            ...employees.map((employee) => ({
              name: employee.name,
              value: employee.id,
            })),
          ],
        },
      ])
      .then((answer) => {
        const query = 'UPDATE employee SET manager_id = ? WHERE id = ?';
        connection.query(query, [answer.manager, answer.employee], (err, res) => {
          if (err) throw err;
          console.log('Employee manager updated successfully.');
          startEmployeeTracker();
        });
      });
  });
}

// Function to view employees by manager
function viewEmployeesByManager() {
  const query = `
    SELECT
      m.id AS manager_id,
      CONCAT(m.first_name, ' ', m.last_name) AS manager_name,
      e.id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      role.title,
      department.name AS department,
      role.salary
    FROM employee e
    INNER JOIN role ON e.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY manager_name, employee_name
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startEmployeeTracker();
  });
}

// Function to view employees by department
function viewEmployeesByDepartment() {
  const query = `
    SELECT
      department.id AS department_id,
      department.name AS department,
      e.id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      role.title,
      role.salary,
      CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    INNER JOIN role ON e.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY department
  `;
  connection.query(query, (err, res) => {
    if (err) throw err;
    console.log('\n');
    console.table(res);
    startEmployeeTracker();
  });
}
