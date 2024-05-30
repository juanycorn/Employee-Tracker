# Employee Tracker

Employee Tracker is a command-line application that allows business owners to manage their departments, roles, and employees efficiently. With this application, you can organize and plan your business by viewing, adding, and updating various aspects of your company's structure.

## Features

- View all departments: Display a formatted table showing department names and IDs.
- View all roles: Show job titles, role IDs, associated departments, and salaries.
- View all employees: Present employee data including IDs, names, job titles, departments, salaries, and managers.
- Add a department: Prompt to enter the name of a new department and add it to the database.
- Add a role: Input the title, salary, and department for a new role and insert it into the database.
- Add an employee: Enter the first name, last name, role, and manager for a new employee and add them to the database.
- Update an employee role: Select an employee to update and their new role, and update this information in the database.

## Installation

1. Clone the repository:

```bash
git clone git@github.com:juanycorn/Employee-Tracker.git
```

2. Navigate to the project directory:

```bash
cd employee-tracker
```

3. Install dependencies:

```bash
npm i
```

4. Set up the database:

- Ensure you have MySQL installed on your system.
- Run the provided schema and seed files to set up the database structure and populate it with initial data.

## Usage

To start the application, run:

```bash
node index.mjs
```
Follow the prompts to perform various actions such as viewing departments, roles, and employees, adding new departments, roles, and employees, and updating employee roles.

## Technologies Used

- Node.js
- MySQL
- Inquirer.js
- console.table