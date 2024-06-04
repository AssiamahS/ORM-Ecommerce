SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title AS role_title, 
    department.name AS department_name, 
    role.salary, 
    COALESCE(manager.first_name || ' ' || manager.last_name, 'None') AS manager_name
FROM 
    employee
JOIN 
    role ON role.id = employee.role_id
JOIN
    employee AS manager ON manager.id = employee.manager_id
JOIN
    department ON department.id = role.department_id;
