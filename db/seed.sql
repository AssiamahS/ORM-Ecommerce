INSERT INTO department (name) 
VALUES
('Engineering'),
('Sales'),
('Warehouse'),
('Venture Capital'),
('Order Fulfillment'),
('Operations'),
('Research and Development'),
('Legal');

INSERT INTO role (title, salary) VALUES
('Lead Software Engineer', 130000),
('Financial Analyst', 70000),
('Marketing Specialist', 80000),
('HR Manager', 85000),
('Legal Counsel', 100000),
('Operations Manager', 90000),
('Product Manager', 110000),
('Sales Manager', 95000),
('Software Engineer', 100000);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('Alice', 'Jones', 1, 7),
('Bob', 'Smith', 3, 6),
('Charlie', 'Brown', 2, 5),
('Diana', 'Miller', 4, 7),
('Eva', 'Taylor', 5, 6),
('Frank', 'Johnson', 6, 5),
('Grace', 'Davis', 7, 1),
('Henry', 'Garcia', 8, 7),
('Isabel', 'Clark', 9, 4);
