import { db } from "../db/db"

const createTable = "CREATE TABLE IF NOT EXISTS todo ( id INTEGER PRIMARY KEY AUTOINCREMENT, task VARCHAR(256) NOT NULL, description VARCHAR(512), status VARCHAR(64) NOT NULL,author VARCHAR(64) NOT NULL, created_at DATE NOT NULL, last_update DATE NOT NULL);"
const createTableQuery = db.query(createTable)
console.log("creating todo table...")
createTableQuery.run()
console.log("todo table created...")
createTableQuery.finalize()

const getTodos = "SELECT * FROM todo;"
const getTodosQuery = db.prepare(getTodos)

const getTodosByAuthor = "SELECT * FROM todo WHERE author=$author;"
const getTodosByAuthorQuery = db.prepare(getTodosByAuthor)

const getTodoById = "SELECT * FROM todo WHERE id=$id;"
const getTodoByIdQuery = db.prepare(getTodoById)

const insertTodo = "INSERT INTO todo (task, description, status, author, created_at, last_update) VALUES ($task, $description, $status, $author, $createdAt, $lastUpdate) RETURNING *;"
const insertTodoQuery = db.prepare(insertTodo)

const updateTodo = "UPDATE todo SET task=$task, description=$description, status=$status , author=$author, last_update=$lastUpdate WHERE id=$id RETURNING *;"
const updateTodoQuery = db.prepare(updateTodo)

const deleteTodoById = "DELETE FROM todo where id=$id;"
const deleteTodoByIdQuery = db.prepare(deleteTodoById)

const deleteTodosByAuthor = "DELETE FROM todo where author=$author;"
const deleteTodosByAuthorQuery = db.prepare(deleteTodosByAuthor)

export { db, getTodosQuery, getTodosByAuthorQuery, getTodoByIdQuery, createTableQuery, insertTodoQuery, updateTodoQuery, deleteTodoByIdQuery, deleteTodosByAuthorQuery}