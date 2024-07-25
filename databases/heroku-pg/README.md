# 🎉 Let's Get Started with Heroku-PG from this Repo! 🐘

## 🚀 Database Migrations

Think of database migrations as your database's personal time machine! 🕰️ They help manage changes and versions of your database schema, allowing it to evolve over time while keeping all your precious data safe and sound. 

It's like having a superpower for your database, giving you the ability to update the database schema in a structured and organized way. With migrations, you can create or drop tables, add or remove columns, or even change the type of existing columns, all with the snap of your fingers! 💥

In this project, each migration will be a SQL script with a naming convention of `date_up.sql`, and `date_down.sql`. Up files are our blueprints, applying changes, and down files are our safety nets, reverting changes if anything goes awry!👷🏽🛟

## 🖍️ Formatting

This repo automatically picks up the 'up' migrations when you push your development branch into main^[[Link to push action](../../.github/workflows/on_push.yml)].  For this magic to work, it'll be looking for '...up.sql' files in the migrations folder ([here](../heroku-pg/migrations/)).

The code that checks for changed files in that folder with up.sql endings is:

```bash
git diff --name-only origin/main | grep 'heroku-pg/migrations/.*\up.sql$' > new_migrations.txt 
```

This new_migrations.txt in this github action is key to getting all our SQL up 📜, it's what'll be looped over to execute the migrations on Heroku!

## Manual Migrations & Queries

It's super super likely that at some point you might also want to ad-hoc query the database, which is great. A few things to note:

- Remember to close your sessions! It is not the end of the world at all if you connection is left open, but if there are more than 20 open, it is in fact the end of anyone else being able to connect to the database. 
- The development tier for Heroku PG limits concurrent connections to 20, so closing yours when your query is done is super important and a good habit to get into. This Python chunk is what I'd recommend getting started with:
  
```python
import psycopg2
import pandas as pd

pg_url = "this'll be what's called a connection string"

def query(query):
    with psycopg2.connect(pg_url, sslmode='require').cursor() as cur:
        res = cur.execute(query)
        return res

your_query = "select * from landing_schema.user_table"
query(your_query)

# This automatically closes the connection by using the 'with' syntax in python. 
# Once the code within 'with' runs, cur.Close() is executed, freeing up the connection for anyone else.
```

- Also, be careful with SQL commands since reversing them can be tough, or at least tedious, and definitely less fun that writing new features. Every engineer at method has dropped a table on accident! 
- A nice way to play it safe is to open a transaction without committing it. This means before your SQL, you add `BEGIN;`. Usually this is used with a closing `COMMIT;` which is a way to tell postgres not to execute any SQL changes until all of your sql between `BEGIN` and `COMMIT` succeeds. But if you don't include `COMMIT` at the end, none of it will be permanent and you can safely play around with any query you'd like.
```python
# Continuing from above

def safe_query(query):
    res = None # will populate and return this variable if there is a result set
    
    try:
        with psycopg2.connect(pg_url, sslmode='require') as conn:
            with conn.cursor() as cursor:
                conn.autocommit = False # Turn off autocommit, this is specific to psycopg2
                cursor.execute(query)
                try:
                    res = pd.DataFrame(cursor.fetchall())
                except:
                    pass # If there's no result set, can just continue on
                print(f"Query run successfully")
            conn.rollback() # Undoes anything after your BEGIN; statement
    except psycopg2.Error as e:
        print(f"Error executing query: {e}")
        
    return res

your_query = "BEGIN; DROP TABLE sample_table_dev;"
safe_query(your_query) # Running this will show you the response from postgres confirming your DROP or letting you know the table isn't there  
# BUT it won't execute the drop since you called conn.rollback() before adding COMMIT;
```

Using this, you can go ahead and test out queries that might impact the state of your data or schemas without commiting to any of it!