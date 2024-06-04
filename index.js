const { Pool } = require('pg');
const inquirer = require('inquirer');

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "employee_tracker",
    password: "pass",
    port: 5432
});

// Function to display main menu
function displayMainMenu() {
  inquirer
    .prompt({
      type: 'list',
      name: 'menuChoice',
      message: 'What would you like to do?',
      choices: [
        'View all employees',
        'View all roles',
        'View all departments',
        'Add employee',
        'Add role',
        'Add department',
        'Update employee role',
        'Exit'
      ],
    })
    .then((answer) => {
      switch (answer.menuChoice) {
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'Add employee':
          addEmployee();
          break;
        case 'Add role':
          addRole();
          break;
        case 'Add department':
          addDepartment();
          break;
        case 'Update employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          console.log('Goodbye!');
          pool.end(); // Close the pool before exiting
          break;
        default:
          console.log('Invalid choice');
          displayMainMenu();
      }
    })
    .catch((err) => {
      console.error('Error:', err);
      displayMainMenu();
    });
}

// Function to view all employees
function viewAllEmployees() {
  const query = `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
    COALESCE(manager.first_name || ' ' || manager.last_name, 'None') AS manager
    FROM employee
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id
  `;
  pool.query(query, (err, res) => {
    if (err) {
      console.error('Error executing query:', err);
      displayMainMenu();
    } else {
      console.table(res.rows);
      displayMainMenu();
    }
  });
}

// Function to view all roles
function viewAllRoles() {
  const query = `
    SELECT role.id, role.title, department.name AS department, role.salary 
    FROM role 
    JOIN department ON role.department_id = department.id
  `;
  pool.query(query, (err, res) => {
    if (err) {
      console.error('Error executing query:', err);
      displayMainMenu();
    } else {
      console.table(res.rows);
      displayMainMenu();
    }
  });
}

// Function to view all departments
function viewAllDepartments() {
  pool.query('SELECT * FROM department', (err, res) => {
    if (err) {
      console.error('Error executing query:', err);
      displayMainMenu();
    } else {
      console.table(res.rows);
      displayMainMenu();
    }
  });
}

// Function to add employee
async function addEmployee() {
  try {
    const roles = await pool.query('SELECT * FROM role');
    const employees = await pool.query('SELECT * FROM employee');

    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id
    }));
    
    const managerChoices = employees.rows.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));
    managerChoices.push({ name: 'None', value: null });

    const answers = await inquirer.prompt([
      { name: 'first_name', message: 'Enter the first name of the employee:' },
      { name: 'last_name', message: 'Enter the last name of the employee:' },
      { name: 'role_id', message: 'Select the role for the employee:', type: 'list', choices: roleChoices },
      { name: 'manager_id', message: 'Select the manager for the employee:', type: 'list', choices: managerChoices }
    ]);

    await pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', 
      [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]);
    
    console.log(`Employee ${answers.first_name} ${answers.last_name} added successfully.`);
    displayMainMenu();
  } catch (err) {
    console.error('Error adding employee:', err);
    displayMainMenu();
  }
}

// Function to add role
async function addRole() {
  try {
    const departments = await pool.query('SELECT * FROM department');

    const departmentChoices = departments.rows.map(dept => ({
      name: dept.name,
      value: dept.id
    }));

    const answers = await inquirer.prompt([
      { name: 'title', message: 'Enter the title of the role:' },
      { name: 'salary', message: 'Enter the salary for the role:' },
      { name: 'department_id', message: 'Select the department for the role:', type: 'list', choices: departmentChoices }
    ]);

    await pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', 
      [answers.title, answers.salary, answers.department_id]);
    
    console.log(`Role ${answers.title} added successfully.`);
    displayMainMenu();
  } catch (err) {
    console.error('Error adding role:', err);
    displayMainMenu();
  }
}

// Function to add department
async function addDepartment() {
  try {
    const answers = await inquirer.prompt([
      { name: 'name', message: 'Enter the name of the department:' }
    ]);

    await pool.query('INSERT INTO department (name) VALUES ($1)', [answers.name]);
    
    console.log(`Department ${answers.name} added successfully.`);
    displayMainMenu();
  } catch (err) {
    console.error('Error adding department:', err);
    displayMainMenu();
  }
}

// Function to update employee role
async function updateEmployeeRole() {
  try {
    const employees = await pool.query('SELECT * FROM employee');
    const roles = await pool.query('SELECT * FROM role');

    const employeeChoices = employees.rows.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));

    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id
    }));

    const answers = await inquirer.prompt([
      { name: 'employee_id', message: 'Select the employee to update:', type: 'list', choices: employeeChoices },
      { name: 'role_id', message: 'Select the new role:', type: 'list', choices: roleChoices }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);

    console.log('Employee role updated successfully.');
    displayMainMenu(); // Return to the main menu
  } catch (err) {
    console.error('Error updating employee role:', err);
    displayMainMenu(); // Return to the main menu even if there's an error
  }
}
// Function to update employee role
async function updateEmployeeRole() {
  try {
    const employees = await pool.query('SELECT * FROM employee');
    const roles = await pool.query('SELECT * FROM role');

    const employeeChoices = employees.rows.map(emp => ({
      name: `${emp.first_name} ${emp.last_name}`,
      value: emp.id
    }));

    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id
    }));

    const answers = await inquirer.prompt([
      { name: 'employee_id', message: 'Select the employee to update:', type: 'list', choices: employeeChoices },
      { name: 'role_id', message: 'Select the new role:', type: 'list', choices: roleChoices }
    ]);

    await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.role_id, answers.employee_id]);

    console.log('Employee role updated successfully.');
    displayMainMenu(); // Return to the main menu
  } catch (err) {
    console.error('Error updating employee role:', err);
    displayMainMenu(); // Return to the main menu even if there's an error
  }
}

// Start the application
displayMainMenu();
