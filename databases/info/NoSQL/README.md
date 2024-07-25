# 📚 Introduction to NoSQL

## 🤔 What is NoSQL?

NoSQL stands for 'Not Only' SQL, and generally refers to any kind of database that is designed to be queried with something other than SQL. Most NoSQL databases have been designed to work with drivers written in common coding languages, while some also have their own query languages that aren't SQL, but work in a similar way.

## 🌟 Why Use NoSQL?
1. **Scalability**: 🌐 Many NoSQL databases were written specifically to handle large amounts of data and a large number of simultaneous connections from the ground up. In cases where your SQL database is a bottleneck due to these issues, there is probably a NoSQL database built to cover that need.
2. **Flexibility**: 🛠️ NoSQL databases give developers the option to model data in the way that makes the most sense to them and their app's use case. The various NoSQL options provide alternatives to standard SQL that can better suit specific needs.
3. **Performance**: ⚡ In some cases, fast data retrieval is all that's important. SQL is performant, but the layers between the data itself and the DB's management system mean that executing queries requires an amount of processing overhead. That overhead might not be needed for all use cases.

## 🗂️ Variants of NoSQL Databases

### 📄 Document Stores
- **Example**: MongoDB, CouchDB
- **Description**: Store data in JSON-like documents, making them flexible and easy to work with. Each document can have a different structure.

### 🔑 Key-Value Stores
- **Example**: Redis, DynamoDB
- **Description**: Use a simple key-value pair for data storage. Ideal for caching and real-time applications due to their high performance.

### 🏛️ Column-Family Stores
- **Example**: Cassandra, HBase
- **Description**: Store data in columns rather than rows, which allows for efficient querying and aggregation of large datasets.

### 🕸️ Graph Databases
- **Example**: Neo4j, ArangoDB
- **Description**: Designed to store and query graph structures. Excellent for applications involving complex relationships, such as social networks.

## 🤷‍♂️ When to Use NoSQL?
- **Dynamic Schema**: 🔄 When dealing with evolving data models that don't fit well into a fixed schema. In cases like this, having the flexibility to store multiple versions of the same object type in one spot can avoid a lot of hassle involved with schema migration needed in SQL.
- **Complex Relationships**: 🌐 Ideal for applications requiring advanced relationship mapping and querying, like social networks or recommendation engines (Graphs!). If your data is not easy to model in SQL that is a good sign it might be time to explore what other database paradigms are available.

[Back to Main README](../README.md)