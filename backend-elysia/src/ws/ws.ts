import { Value } from "@sinclair/typebox/value";
import Elysia, { t } from "elysia";
import { ElysiaWS, ElysiaWSContext, ws } from "elysia/ws";

const pool = {} as Record<string, ElysiaWS<ElysiaWSContext<any>>>

function registerWebsocket(ws: ElysiaWS<any>) {
    pool[ws.data.id] = ws
}

function unregisterWebsocket(ws: ElysiaWS<any>) {
    delete pool[ws.data.id]
}

function sendMessageToSubscriber(topic: string ,message: any) {
    Object.values(pool).filter(it => it.raw.isSubscribed(topic)).forEach(it => it.send(message))
}

const wsEvent = t.Union([
    t.Object({
        type: t.Union([t.Literal("SUBSCRIBE"), t.Literal("UNSUBSCRIBE")]),
        topic: t.String({ minLength: 1 })
    }),
    t.Object({
        type: t.Literal("MESSAGE"),
        topic: t.String({ minLength: 1 }),
        message: t.String({ minLength: 1 })
    })
])

export const stateWs = new Elysia()
    .state("socketPool", pool)
    .state("registerWebsocket", registerWebsocket)
    .state("unregisterWebsocket", unregisterWebsocket)
    .state("sendMessageToSubscriber", sendMessageToSubscriber)
    .model({
        'ws.event' : wsEvent
    })
export const appWs = new Elysia()
    .use(stateWs)
    .use(ws())
    .ws("/ws", {
            // PUB/SUB doesn't seem to work yet 
            open(ws) {
                const { registerWebsocket } = ws.data.store as { registerWebsocket: (elysiaWS: ElysiaWS<any>) => void}
                registerWebsocket(ws)
            },
            close(ws) {
                const { unregisterWebsocket } = ws.data.store as { unregisterWebsocket: (elysiaWS: ElysiaWS<any>) => void}
                unregisterWebsocket(ws)
            },
            message(ws, message) {
                // Parsing message here because of different protocol in error handling
                if(Value.Check(wsEvent, message)) {
                    switch(message.type) {
                        case "SUBSCRIBE": return ws.subscribe(message.topic)
                        case "UNSUBSCRIBE": return ws.unsubscribe(message.topic)
                        case "MESSAGE": {
                            const { sendMessageToSubscriber } = ws.data.store as { sendMessageToSubscriber: (topic: string, message: string) => void }
                            sendMessageToSubscriber(message.topic, message.message);
                        }
                    }
                } else {
                    const message = { message: "WS Message is not in the right format!",
                    status: "error",
                    acceptedFormat: appWs.meta.defs['ws.event']}
                    ws.send(message)
                }
            },
    })
    