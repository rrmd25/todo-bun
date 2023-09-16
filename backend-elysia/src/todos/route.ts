import Elysia, { t, ws } from "elysia";
import { todoService } from "./service";
import { Status, Todo } from "./Todo";
import { stateWs } from "../ws/ws";

function paramIdToNumber({ params }: { params: { id: string | number }}){
    const id = +params.id
    if(!Number.isNaN(id)) params.id = id
}

const todos = new Elysia({ prefix: "/todos" })
    .use(stateWs)
    .model({
        'todo.idparam.number': t.Object({
            id: t.Number({minimum: 1})
        }),
        'todo.body': t.Object({
            task: t.String({minLength: 1}),
            author: t.String({minLength: 1}),
            description: t.String(),
            status: t.Enum(Status)
        })
    })
    .get("", () => todoService.getTodos())
    .get("/:id", ({ params: { id } }) => todoService.getTodo(id), {
        params: 'todo.idparam.number',
        transform: paramIdToNumber
    })
    .post("/", ({ set, body, store }) => {
        set.status = 201
        const res = todoService.createTodo({ ...body } as Todo)
        const wsMessage = { operation: "CREATE", todo : res}
        store.sendMessageToSubscriber("todo", wsMessage)
        return res
    }, {
            body: 'todo.body',
    })
    .put("/:id", ({ set, body, store, params: { id } }) => {
        set.status = 200
        const res = todoService.updateTodo(id, { ...body} as Todo)
        const wsMessage = { operation: "UPDATE", todo: res}
        store.sendMessageToSubscriber("todo", wsMessage)
        return res
    }, {
        body: 'todo.body',
        params: 'todo.idparam.number',
        transform: paramIdToNumber
    }
    )
    .delete("/:id", ({ params: { id }, store }) => {
        const res = todoService.deleteTodo(id)
        const wsMessage = { operation: "DELETE", todo : { id }}
        store.sendMessageToSubscriber("todo", wsMessage)
    }, {
        params: 'todo.idparam.number',
        transform({ params }) {
            const id = +params.id
            if(!Number.isNaN(id)) params.id = id
        }
    })

export { todos };