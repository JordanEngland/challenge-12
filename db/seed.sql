-- Use the employee_tracker_db database
USE employee_tracker_db;

-- Insert sample data into the department table
INSERT INTO department (name) VALUES
  ('Sales'),
  ('Marketing'),
  ('Human Resources'),
  ('Engineering');

-- Insert sample data into the role table
INSERT INTO role (title, salary, department_id) VALUES
  ('Sales Manager', 80000, 1),
  ('Sales Representative', 50000, 1),
  ('Marketing Manager', 75000, 2),
  ('Marketing Coordinator', 45000, 2),
  ('HR Manager', 70000, 3),
  ('HR Specialist', 40000, 3),
  ('Software Engineer', 90000, 4),
  ('Front-end Developer', 60000, 4),
  ('Back-end Developer', 70000, 4);

-- Insert sample data into the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
  ('John', 'Doe', 1, NULL),
  ('Jane', 'Smith', 2, 1),
  ('Mike', 'Johnson', 3, 1),
  ('Emily', 'Williams', 4, 2),
  ('David', 'Brown', 5, 3),
  ('Jessica', 'Taylor', 6, 3),
  ('Michael', 'Anderson', 7, 4),
  ('Sarah', 'Davis', 8, 5),
  ('Christopher', 'Wilson', 9, 5);
