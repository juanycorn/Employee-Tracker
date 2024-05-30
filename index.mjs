import inquirer from 'inquirer';
import { connectToDatabase } from './db/index.mjs';

// Start the application
async function startApp() {
  try {
    const db = await connectToDatabase();
    console.log('Connected to the database.');
    runApp();
  } catch (error) {
    console.error('Error starting the application:', error.message);
  }
}

// Run the application
function runApp() {
  inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What would you like to do?',
    choices: [
      'View All Departments',
      'View All Roles',
      'View All Employees',
      'Add Department',
      'Add Role',
      'Add Employee',
      'Update Employee Role',
      'Exit'
    ]
  }).then(answer => {
    switch (answer.action) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        db.end();
        console.log('Disconnected from the database.');
        break;
    }
  });
}

// View all departments
async function viewDepartments() {
  const sql = 'SELECT * FROM departments';
  const departments = await executeQuery(sql);
  console.table(departments);
  runApp(); // Restart the application after viewing departments
}

// View all roles
async function viewRoles() {
  const sql = `
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
  `;
  const roles = await executeQuery(sql);
  console.table(roles);
  runApp(); // Restart the application after viewing roles
}

// View all employees
async function viewEmployees() {
  const sql = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees manager ON manager.id = employees.manager_id
  `;
  const employees = await executeQuery(sql);
  console.table(employees);
  runApp(); // Restart the application after viewing employees
}

// Add a department
async function addDepartment() {
  const answer = await inquirer.prompt({
    name: 'name',
    type: 'input',
    message: 'Enter the name of the department:'
  });
  const sql = 'INSERT INTO departments SET ?';
  await executeQuery(sql, { name: answer.name });
  console.log(`Department ${answer.name} added!`);
  runApp(); // Restart the application after adding a department
}

// Add a role
async function addRole() {
  const departments = await executeQuery('SELECT * FROM departments');
  const answers = await inquirer.prompt([
    {
      name: 'title',
      type: 'input',
      message: 'Enter the role title:'
    },
    {
      name: 'salary',
      type: 'input',
      message: 'Enter the role salary:'
    },
    {
      name: 'department_id',
      type: 'list',
      message: 'Select the department:',
      choices: departments.map(department => ({
        name: department.name,
        value: department.id
      }))
    }
  ]);
  const sql = 'INSERT INTO roles SET ?';
  await executeQuery(sql, {
    title: answers.title,
    salary: answers.salary,
    department_id: answers.department_id
  });
  console.log(`Role ${answers.title} added!`);
  runApp(); // Restart the application after adding a role
}

// Add an employee
async function addEmployee() {
  const roles = await executeQuery('SELECT * FROM roles');
  const employees = await executeQuery('SELECT * FROM employees');
  const answers = await inquirer.prompt([
    {
      name: 'first_name',
      type: 'input',
      message: 'Enter the first name:'
    },
    {
      name: 'last_name',
      type: 'input',
      message: 'Enter the last name:'
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select the role:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    },
    {
      name: 'manager_id',
      type: 'list',
      message: 'Select the manager:',
      choices: [{ name: 'None', value: null }].concat(
        employees.map(employee => ({
          name: `${employee.first_name} ${employee.last_name}`,
          value: employee.id
        }))
      )
    }
  ]);
  const sql = 'INSERT INTO employees SET ?';
  await executeQuery(sql, {
    first_name: answers.first_name,
    last_name: answers.last_name,
    role_id: answers.role_id,
    manager_id: answers.manager_id
  });
  console.log(`Employee ${answers.first_name} ${answers.last_name} added!`);
  runApp(); // Restart the application after adding an employee
}

// Update an employee role
async function updateEmployeeRole() {
  const employees = await executeQuery('SELECT * FROM employees');
  const roles = await executeQuery('SELECT * FROM roles');
  const answers = await inquirer.prompt([
    {
      name: 'employee_id',
      type: 'list',
      message: 'Select the employee:',
      choices: employees.map(employee => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id
      }))
    },
    {
      name: 'role_id',
      type: 'list',
      message: 'Select the new role:',
      choices: roles.map(role => ({
        name: role.title,
        value: role.id
      }))
    }
  ]);
  const sql = 'UPDATE employees SET ? WHERE ?';
  await executeQuery(sql, [{ role_id: answers.role_id }, { id: answers.employee_id }]);
  console.log(`Employee role updated!`);
  runApp(); // Restart the application after updating an employee role
}

// Function to execute a query
async function executeQuery(sql, params) {
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Error executing query:', error.message);
    throw error;
  }
}

// Call the startApp function to begin the application
startApp();
