import { NotFoundError } from "elysia";
import { Todo } from "./Todo";
import { deleteTodoByIdQuery, getTodoByIdQuery, getTodosQuery, insertTodoQuery, updateTodoQuery } from "./db";
import { ResourceNotFoundError } from "../errors/error";

class TodoService {
    
    getTodos() {
        return getTodosQuery.all()
    }

    getTodo(id: number) {
        const res = getTodoByIdQuery.get({ $id: id })
        if(res === null) throw new ResourceNotFoundError("Element not found!")
        return res
    }

    createTodo(todo: Todo) {
        return insertTodoQuery.get({ $task: todo.task, $status: todo.status, $author: todo.author, $description: todo.description, $createdAt: Date.now(), $lastUpdate: Date.now()})
    }

    deleteTodo(id: number) {
        deleteTodoByIdQuery.get({ $id: id })
        return { "message": "Deleted!" }
    }

    updateTodo(id: number, todo: Todo) {
        return updateTodoQuery.get({ $task: todo.task, $author: todo.author, $status: todo.status , $description: todo.description, $lastUpdate: Date.now()})
    }

}

export const todoService = new TodoService()

