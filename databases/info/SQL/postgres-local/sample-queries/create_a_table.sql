-- The following SQL query is a type of query called DDL (Data Definition Language)
-- DDL is used to define the structure that holds the data in a database
-- The most fundamental case of DDL is the CREATE TABLE statement, which creates a new table in the database

-- The following query creates a table named users with four columns: id, name, email, and age
-- Each column has name, datatype, and constraints (and more!) that define the type of data that can be stored in that column
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  age INT
);

-- After running this query, you can now see the table in the database by running the following query:
--  SELECT * FROM users;
-- You can also see the structure of the table by running the following query:
--  \d users; (note, this is a `psql` command, not an SQL query)
-- try running \d users; in the psql shell to see the structure of the table you just created


-- Anoter kind of query is DML (Data Manipulation Language)
-- DML is used to add, update, delete, or in any way modify the data in the database
-- The most common DML statements are INSERT, UPDATE, and DELETE

-- Now that you have a table, you can write a chunk of DML to insert data into it using the INSERT INTO statement
-- Here, we'll insert some sample data into the users table
-- After INSET INTO, we defined the structure of the rows we'll be inserting 
-- The values in the parentheses are the values we want to insert into the table, which follow the keyword VALUES
INSERT INTO users (name, email, age) VALUES
('Alex Kim', 'alex.kim@example.com', 25),
('Jordan Patel', 'jordan.patel@example.com', 30),
('Taylor Nguyen', 'taylor.nguyen@example.com', 28),
('Morgan Lee', 'morgan.lee@example.com', 22),
('Chris Martinez', 'chris.martinez@example.com', 35),
('Samira Khan', 'samira.khan@example.com', 27),
('Liam O''Connor', 'liam.oconnor@example.com', 31);

-- After running this query, you can see the data in the table by running the following query:
--  SELECT * FROM users;

-- Now we'll come back to DLL to create another table named orders
-- Here, we'll create a table named orders with four columns: id, user_id, product, and amount
-- The user_id column is a foreign key that references the id column in the users table
-- Foreign keys are used to create a relationship between two tables so that the data in one table can be linked to the data in another table
-- Here, that means we can see who placed what order by linking the user_id in the orders table to the id in the users table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT,
  product VARCHAR(100),
  amount DECIMAL(10, 2),
  FOREIGN KEY (user_id) REFERENCES users(id)
);


-- Now that we have the orders table, we can insert some sample data into it
INSERT INTO orders (user_id, product, amount) VALUES
(1, 'Laptop', 999.99),
(2, 'Phone', 499.99),
(3, 'Tablet', 299.99),
(4, 'Monitor', 199.99),
(5, 'Keyboard', 49.99),
(6, 'Mouse', 29.99),
(1, 'Headphones', 149.99),
(2, 'Charger', 39.99),
(3, 'Camera', 899.99),
(4, 'Printer', 129.99);


-- So who ordered what? We can find out by joining the users and orders tables
-- Here, we're using an INNER JOIN to combine the users and orders tables based on the user_id column in the orders table and the id column in the users table
-- Any rows that don't have a match in both tables will be excluded from the result set, so we'll only see the users who have placed orders
-- If there are any orders without a corresponding user, they won't be included in the query result either
SELECT users.name, orders.product, orders.amount
FROM users
INNER JOIN orders ON users.id = orders.user_id;


-- Now, let's say we want to find out how much each user has spent in total
-- We can do this by grouping the results by the user's name and summing the amount of each order
-- Here we see three, new-to-this-file, SQL concepts: Grouping, Aggregating, and Ordering
-- Grouping is done with the GROUP BY clause, which groups the results based on the specified column(s)
-- Grouped results can be aggregated using aggregate functions like SUM, AVG, MIN, MAX, and COUNT
-- Here, we're using the SUM function to calculate the total amount spent by each user
-- Since users.name is in the GROUP BY clause, sum(orders.amount) will be calculated by user
-- Finally, we're ordering the results by the total_spent column in descending order
-- This means that the user who has spent the most will be at the top of the list
SELECT users.name, SUM(orders.amount) AS total_spent
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.name
ORDER BY total_spent DESC;
-- And if we want to see only the top spender, we can add a LIMIT clause to the query
SELECT users.name, SUM(orders.amount) AS total_spent
FROM users
INNER JOIN orders ON users.id = orders.user_id
GROUP BY users.name
ORDER BY total_spent DESC
LIMIT 1;

-- And that's it! You've created two tables, inserted some sample data, joined the tables to see who ordered what, and found out who the top spender is
-- This is just the tip of the iceberg when it comes to SQL, but it should give you a good starting point for working with databases and understanding normalized data
-- Hope you enjoyed this short intro -- feel free to slack me with any questions or to chat about SQL!  -@caleb.hopkins on method's slack
