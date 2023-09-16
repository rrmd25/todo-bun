
import swagger from "@elysiajs/swagger";
import Elysia, { t, ws } from "elysia";
import { db } from "./src/db/db";
import { todos } from "./src/todos/route";
import { errorHandler } from "./src/errors/handler";
import { ElysiaWS, ElysiaWSContext } from "elysia/ws";
import { appWs } from "./src/ws/ws";
const PORT = Bun.env.ELYSIA_PORT ?? 3000



new Elysia()
    .use(ws())
    .use(appWs)
    .use(errorHandler)
    .use(swagger({ path:"/docs" }))
    .get("/", () => "Hello!")
    .use(todos)
    .listen(PORT, () => console.log(`Elysia is running on ${PORT}`))
    .onStop((app) => {
        db.close()
    });
