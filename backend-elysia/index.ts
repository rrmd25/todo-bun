
import swagger from "@elysiajs/swagger";
import Elysia, { ws } from "elysia";
import { db } from "./src/db/db";
import { todos } from "./src/todos/route";
import { errorHandler } from "./src/errors/handler";
import { socketPool } from "./src/socketPool";
import { ElysiaWS, ElysiaWSContext } from "elysia/ws";
const PORT = Bun.env.ELYSIA_PORT ?? 3000



new Elysia()
    .use(ws())
    .use(socketPool)
    .ws("/ws", {
        open(ws) {
            const { socketPool } = ws.data.store as { socketPool: Record<number, ElysiaWS<any>>}
            Object.values(socketPool).forEach(it => it.send(JSON.stringify({message: `${ws.data.id} joined!`})))
            if(ws.data.id != null) {
                socketPool[ws.data.id] = ws
            }
        },
        close(ws) {
            const { socketPool } = ws.data.store as { socketPool: Record<string, ElysiaWS<any>>}
            ws.raw.unsubscribe("todo")
            delete socketPool[ws.data.id]
        }
    })
    .use(errorHandler)
    .use(swagger({ path:"/docs" }))
    .get("/", () => "Hello!")
    .use(todos)
    .listen(PORT, () => console.log(`Elysia is running on ${PORT}`));
db.close()

export { socketPool as socketManager };
