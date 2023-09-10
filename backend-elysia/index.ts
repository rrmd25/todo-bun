import swagger from "@elysiajs/swagger";
import Elysia from "elysia";
import { db } from "./src/db/db";
import { todos } from "./src/todos/route";
import { errorHandler } from "./src/errors/handler";
const PORT = Bun.env.ELYSIA_PORT ?? 3000
new Elysia()
    .use(errorHandler)
    .use(swagger({ path:"/swagger" }))
    .get("/", () => "Hello!")
    .use(todos)
    .listen(PORT, () => console.log(`Elysia is running on ${PORT}`));
db.close()