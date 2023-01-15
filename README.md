# Book Library API

A book library API created using an Express.js app connected via Sequelize to a PostgreSQL database in a Docker container.


## Table of contents

- [Introduction](#introduction)
- [Concepts covered](#concepts-covered)
- [Setup & getting started](#setup-&-getting-started)
- [API end points](#API-end-points)
- [Models](#models)

## Introduction
Following on from the music library project (https://github.com/cocomarine/music-library), this project involves creating an Express API that stores information about readers, books, genres and authors. Users can create accounts ('readers') and list books ('books') with their genre ('genres') and author ('authors') information for browsing books. When a book is loaned or returned by a user, the book record is updated by adding or removing the user's ID ('ReaderId'). 

## Concepts covered

- Interpreting user stories and translating into app features
- Creating a web server using Express
- Handling HTTP requests and responses and errors
- Creating API using CRUD (Create, Read, Update and Delete) operations on databases
- Routing, middleware and controller functions
- Database synchronisation, manipuation and validation using Sequelize, a promise-based Node.js ORM (Object-Relational Mapping) tool
- Establishing complex relationships between database tables
- Creating test and development PostgreSQL databases in a Docker container
- Interacting with database using node-postgres, a collection of node.js modules 
- Use of helpers and refractoring to make code DRY
- Using Postman to manage API requests
- Integration testing using Mocha, Chai and SuperTest
- Use of Dotenv to store sensitive information
- Use of Nodemon to automatically restart the node application when code changes

## Setup & getting started
1. Start by running postgres in a Docker container.
```bash
docker run --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password -d postgres
```
2. Make sure pgAdmin and Postman are installed.
3. Run pgAdmin and add new server with the following credentials to connect to the container-run postgres. 
    - hostname/address: localhost or the ip address of your postgres container
    - user: postgres
    - password: password

4. Create a fork of this repo. Then clone the repo and install project dependencies.
```bash 
git clone git@github.com:[your-github-username]/book-library-api # to clone your copy of the repo
npm install # to download dependencies defined in the package.json file
```
5. Create a .env file in the root of your project. This contains environment variables that Dotenv loads into process.env in the create-database.js file. 
```bash
    PGPASSWORD=password
    PGDATABASE=book_library_dev
    PGUSER=postgres
    PGHOST=localhost
    PGPORT=5433
```
6. Also, create a .env.test file to be used for creating test database by copying the same environment variables as .env but with different database name such as 'book_library_test'.

7. Add .env and .env.test to .gitignore to prevent your credentials from commited to Github.

8. To test or run the app, run the following commands.
```bash
npm test  # to test the codes
npm start # to start the app at http://localhost:3000
```
9. Use Postman and pgAdmin to check if the CRUD operations are working.


----------------
## API end points

### Book

<details>
 <summary><code>POST</code> <code><b>/books</b></code> <code>(add a new book)</code></summary>

#### Parameters and body content

> | Parameters | Body content, required |  Optional |
> |------------|------------------------|-----------|
> | None       | title [string], ISBN [string], AuthorId [integer], GenreId [integer] | ReaderId [integer] |


#### Responses

> | code | description |
> |------|-------------|
> | `201` | successful operation |
> | `400` | content element empty, null or not unique  |
 
</details>


<details>
 <summary><code>GET</code> <code><b>/books</b></code> <code>(find all the books)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | None | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | books not found |
 
</details>

<details>
 <summary><code>GET</code> <code><b>/books/{id}</b></code> <code>(find a book by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `bookId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | book not found |
 
</details>


<details>
 <summary><code>PATCH</code> <code><b>/books/{id}</b></code> <code>(update a book by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|----------------|
> | `bookId`   | title [string], ISBN [string], AuthorId [integer], GenreId [integer] or ReaderId [integer] |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | book not found |
 
</details>

<details>
 <summary><code>DELETE</code> <code><b>/books/{id}</b></code> <code>(delete a book by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `bookId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `204` | successful operation |
> | `404` | book not found |
 
</details>

### Reader

<details>
 <summary><code>POST</code> <code><b>/readers</b></code> <code>(add a new reader)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|-----------------------------------|
> |  None      | name [string,], email [string, email format], password [string, more than 8 characters] |


#### Responses

> | code | description |
> |------|-------------|
> | `201` | successful operation |
> | `400` | content element empty, null, not unique, not right format or not right length  |
 
</details>


<details>
 <summary><code>GET</code> <code><b>/readers</b></code> <code>(find all the readers)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | None | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | readers not found |
 
</details>


<details>
 <summary><code>GET</code> <code><b>/readers/{id}</b></code> <code>(find a reader by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `readerId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | reader not found |
 
</details>

<details>
 <summary><code>PATCH</code> <code><b>/readers/{id}</b></code> <code>(update a reader by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|-----------------------------------|
> | `readerId`  |  name [string,], email [string, email format] or password [string, more than 8 characters] |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | reader not found |
 
</details>

<details>
 <summary><code>DELETE</code> <code><b>/readers/{id}</b></code> <code>(delete a reader by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `readerId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `204` | successful operation |
> | `404` | reader not found |
 
</details>

### Author

<details>
 <summary><code>POST</code> <code><b>/authors</b></code> <code>(add a new author)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|----------------|
> | None       | author[string] |


#### Responses

> | code | description |
> |------|-------------|
> | `201` | successful operation |
> | `400` | content element empty, null or not unique  |
 
</details>


<details>
 <summary><code>GET</code> <code><b>/authors</b></code> <code>(find all the authors)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | None | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | authors not found |
 
</details>


<details>
 <summary><code>GET</code> <code><b>/authors/{id}</b></code> <code>(find an author by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `authorId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | author not found |
 
</details>

<details>
 <summary><code>PATCH</code> <code><b>/authors/{id}</b></code> <code>(update an author by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|-----------------------------------|
> | `authorId`   | author [string] |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | author not found |
 
</details>

<details>
 <summary><code>DELETE</code> <code><b>/authors/{id}</b></code> <code>(delete an author by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `authorId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `204` | successful operation |
> | `404` | author not found |
 
</details>

### Genre

<details>
 <summary><code>POST</code> <code><b>/genres</b></code> <code>(add a new genre)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|----------------|
> | None       | genre[string] |


#### Responses

> | code | description |
> |------|-------------|
> | `201` | successful operation |
> | `400` | content element empty, null or not unique  |
 
</details>

<details>
 <summary><code>GET</code> <code><b>/genres</b></code> <code>(find all the genres)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | None | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | genres not found |
 
</details>


<details>
 <summary><code>GET</code> <code><b>/genres/{id}</b></code> <code>(find a genre by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `genreId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | genre not found |
 
</details>

<details>
 <summary><code>PATCH</code> <code><b>/genres/{id}</b></code> <code>(update a genre by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|-----------------------------------|
> | `genreId`   | author [string] |


#### Responses

> | code | description |
> |------|-------------|
> | `200` | successful operation |
> | `404` | genre not found |
 
</details>

<details>
 <summary><code>DELETE</code> <code><b>/genres/{id}</b></code> <code>(delete a genre by ID)</code></summary>

#### Parameters and body content

> | Parameters | Body content |
> |------------|--------------|
> | `genreId` | None |


#### Responses

> | code | description |
> |------|-------------|
> | `204` | successful operation |
> | `404` | genre not found |
 
</details>

------------------
## Models

<details>
 <summary>Books</summary>

> | column | data type |
> |------|-------------|
> | id | integer (PK) |
> | title | string |
> | ReaderId | integer (FK)|
> | GenreId | integer (FK)|
> | AuthorID | integer (FK) |
> | Reader |
> | Genre |
> | Author |

</details>

<details>
 <summary>Readers</summary>

> | column | data type |
> |------|-------------|
> | id | integer (PK) |
> | name | string |
> | email | string|
> | password | string|
> | Books |

</details>

<details>
 <summary>Authors</summary>

> | column | data type |
> |------|-------------|
> | id | integer (PK) |
> | author | string |
> | Books |

</details>

<details>
 <summary>Genres</summary>

> | column | data type |
> |------|-------------|
> | id | integer (PK) |
> | genre | string |
> | Books |

</details>