import Elysia, { t } from "elysia";
import { todoService } from "./service";
import { Todo } from "./Todo";

const todos = new Elysia({ prefix: "/todos" })
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
    .post("/", ({ set, body }) => {
        set.status = 201
        return todoService.createTodo({ ...body } as Todo)
    }, {
            body: t.Object({
                task: t.String(),
                author: t.String(),
                description: t.String(),
            }),
    })

export { todos };