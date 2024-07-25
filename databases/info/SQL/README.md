# SQL Databases 🗄️

This directory contains examples for SQL databases using PostgreSQL both locally and on Heroku.

## What is SQL? 🤔

**SQL (Structured Query Language)** is a standard programming language specifically designed for managing and manipulating relational databases. It is used to execute queries, retrieve data, insert records, update and delete records, and manage database schema.

### Benefits of SQL 🌟

- **Structured Data**: SQL databases use a structured schema to define data, making it easy to organize and retrieve information.
- **ACID Compliance**: Ensures that transactions are processed reliably, which is crucial for applications that require strong data integrity (Atomicity, Consistency, Isolation, Durability).
- **Flexibility with Complex Queries**: SQL supports complex queries, joins, and aggregations, allowing for powerful data manipulation and retrieval.
- **Standardization**: SQL is widely adopted and standardized, making skills and knowledge transferable across different systems and applications.

### Drawbacks of SQL ⚠️

- **Scalability**: SQL databases can face challenges with horizontal scaling, especially with very large datasets or high-transaction environments.
- **Rigid Schema**: The structured schema can be inflexible, making it difficult to handle unstructured or semi-structured data without significant changes.
- **Complexity for Simple Use Cases**: For simple data storage needs, SQL databases can be overkill and more complex to set up and manage compared to NoSQL alternatives.

## Setting Up PostgreSQL with Docker 🛠️

## But first, WHY postgres?

[Find out here](./postgres-local/pro-postgres.md)

### Setting Up Docker 🐳

1. **Install Docker**: Follow the instructions on the [official Docker website](https://docs.docker.com/get-docker/) to install Docker on your local machine.
2. **Verify Installation**: After installation, verify that Docker is installed correctly by running the following command in your terminal:

```bash
docker --version
```

You should see the Docker version information displayed.

### Running PostgreSQL in Docker 🐘

1. **Pull PostgreSQL Image**: Pull the official image from Docker Hub:
```bash
docker pull postgres
```
2. **Run PostgreSQL Container**: Run the container with the following command:
```bash
docker run --name postgres-db -e POSTGRES_PASSWORD=mysecretpassword -d -p 5432:5432 postgres
```

This command does the following:

- `--name postgres-db`: Names the container postgres-db.
- `-e POSTGRES_PASSWORD=mysecretpassword`: Sets the password for the postgres user.
- `-d`: Runs the container in detached mode.
- `-p 5432:5432`: Maps port 5432 of the container to port 5432 of the host machine.

3. **Access PostgreSQL**: You can access the PostgreSQL database using any PostgreSQL client, such as `psql` or a GUI tool like pgAdmin. For example, to connect using `psql`:
```bash
psql -h localhost -U postgres -d postgres
```
Instructions to install `psql` command line tool: [How to install psql](https://www.timescale.com/blog/how-to-install-psql-on-mac-ubuntu-debian-windows/)

You're now all set to get started with postgres. Jump over the [sample-queries](./postgres-local/sample-queries/create_a_table.sql) folder for a quick intro the basics of keeping data in postgres!