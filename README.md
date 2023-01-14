# Book Library API

A book library API created using an Express.js app connected via Sequelize to a PostgreSQL database in a Docker container.

## Introduction
Following on from the music library project (XXXX), this project involves creating an Express API that stores information about readers, books, genres and authors. Users can create accounts ('readers') and list books ('books') with their genre ('genres') and author ('authors') information for them to browse books. When a book is loaned or returned by a user, the book record is to be updated by adding or removing the user's ID ('ReaderId'). 


## Concepts covered

- Interpreting user stories to plan work
- Creating a web server using Express
- HTTP requests and responses
- Creating API using CRUD (Create, Read, Update and Delete) operations on databases
- Error handling 
- Routing, middleware and controller functions
- Database synchronisation, manipuation and validation using Sequelize, a promise-based Node.js ORM (Object-Relational Mapping) tool
- Establishing complex relationships between database tables
- Interacting with test and development databases in a Docker container
- Use of helpers and refractoring to make code DRY
- Using Postman to manage API requests
- Integration testing using Mocha, Chai and SuperTest
- Use of Dotenv to store sensitive information
- Use of Nodemon to automatically restart the node application when code changes

## Setup & getting started
1. Start by running Postgres in a Docker containerXXXXX. 
2. Set up the repository. 
    - asdfasdf
    - asdfasdfa

3. Set up the application. 
4. Set up the test environment. 
5. Run following commands.

6. Use Postman and pgAdmin to check if the CRUD operations are working.


how to spin up the database, how did you get this running? Was it a docker container? If there are any commands needed to do this they should be listed here in a setup section

----------------
## API end points

### Book

<details>
 <summary><code>POST</code> <code><b>/books</b></code> <code>(add a new book)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | None       | name [string], genre [string] |


#### Responses

> | code | description |
> |------|-------------|
> | `201` | successful operation

</details>

### Album

<details>
 <summary><code>POST</code> <code><b>/artists/{id}/albums</b></code> <code>(add a new album associated to an artist)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `artistId` | name [string], year [integer] |


#### Responses

> | code | description |
> |------|-------------|
> | `201` | successful operation

</details>

------------------
## Models

<details>
 <summary>Books</summary>

> | column | data type |
> |------|-------------|
> | id | integer (PK) |
> | name | string |
> | genre | string |

</details>

<details>
 <summary>Readers</summary>

> | column | data type |
> |------|-------------|
> | id | integer (PK) |
> | name | string |
> | year | integer |
> | artistId | integer (FK) |

</details>