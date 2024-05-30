USE company_db;

-- Seed departments
INSERT INTO departments (name) VALUES 
('Engineering'),
('Finance'),
('Human Resources'),
('Sales');

-- Seed roles
INSERT INTO roles (title, salary, department_id) VALUES 
('Software Engineer', 75000, 1),
('Accountant', 55000, 2),
('HR Manager', 60000, 3),
('Sales Manager', 65000, 4);

-- Seed employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('John', 'Doe', 1, NULL),
('Jane', 'Smith', 2, 1),
('Mike', 'Johnson', 3, 1),
('Sara', 'Williams', 4, 2);
