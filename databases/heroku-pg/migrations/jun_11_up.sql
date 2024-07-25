-- Path: databases/heroku-pg/migrations/jun_11_up.sql
-- Create a table named 'sample_table' with 12 different data types
CREATE TABLE sample_table_dev (
    id SERIAL PRIMARY KEY,       -- Auto-incrementing integer
    integer_column INTEGER,      -- Regular integer
    bigint_column BIGINT,        -- Big integer
    smallint_column SMALLINT,    -- Small integer
    serial_column SERIAL,        -- Auto-incrementing serial integer
    varchar_column VARCHAR(255), -- Variable character string
    text_column TEXT,            -- Text field
    date_column DATE,            -- Date field
    timestamp_column TIMESTAMP,  -- Timestamp field
    boolean_column BOOLEAN,      -- Boolean field
    decimal_column DECIMAL(10, 2), -- Decimal field with precision
    json_column JSON            -- JSON field
);

  
-- insert some sample data
INSERT INTO sample_table_dev (integer_column, bigint_column, smallint_column, varchar_column, text_column, date_column, timestamp_column, boolean_column, decimal_column, json_column)
VALUES (1, 2, 3, 'hello', 'world', '2020-01-01', '2020-01-01 00:00:00', true, 1.23, '{"key": "value"}'),
       (4, 5, 6, 'foo', 'bar', '2020-02-02', '2020-02-02 00:00:00', false, 4.56, '{"key": "value"}'),
       (7, 8, 9, 'baz', 'qux', '2020-03-03', '2020-03-03 00:00:00', true, 7.89, '{"key": "value"}');

