-- Create department table
CREATE TABLE IF NOT EXISTS department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Create role table
CREATE TABLE IF NOT EXISTS role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INTEGER NOT NULL,
    CONSTRAINT fk_department_id FOREIGN KEY (department_id) REFERENCES department(id)
);

-- Create employee table
CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES role(id),
    CONSTRAINT fk_manager_id FOREIGN KEY (manager_id) REFERENCES employee(id)
);
