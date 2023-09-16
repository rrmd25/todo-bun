import Elysia, { t, ws } from "elysia";
import { todoService } from "./service";
import { Todo } from "./Todo";
import { socketPool } from "../socketPool";

const todos = new Elysia({ prefix: "/todos" })
    .use(socketPool)
    .get("", () => todoService.getTodos())
    .get("/:id", ({ params: { id } }) => todoService.getTodo(id), {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id
            if(!Number.isNaN(id)) params.id = id
        }
    })
    .post("/", ({ set, body, store }) => {
        set.status = 201
        const res = todoService.createTodo({ ...body } as Todo)
        const wsMessage = { operation: "POST", todo : res}
        Object.values(store.socketPool).forEach(it => it.send(wsMessage))
        return res
    }, {
            body: t.Object({
                task: t.String(),
                author: t.String(),
                description: t.String(),
            }),
    })
    .delete("/:id", ({ params: { id }, store }) => {
        const res = todoService.deleteTodo(id)
        const wsMessage = { operation: "DELETE", todo : { id }}
        Object.values(store.socketPool).forEach(it => it.send(wsMessage))
    }, {
        params: t.Object({
            id: t.Number()
        }),
        transform({ params }) {
            const id = +params.id
            if(!Number.isNaN(id)) params.id = id
        }
    })

export { todos };