import Elysia from "elysia"
import { ResourceNotFoundError } from "./error"

export const errorHandler = new Elysia()
    .addError({
        NotFoundError: ResourceNotFoundError
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'NotFoundError':
                set.status = 404
                return createErrorJsonResponse(error, 404)
        }
    })

export function createErrorJsonResponse(error: Error, status: number) {
    return { timestamp: new Date().toISOString(), locale: Intl.DateTimeFormat().resolvedOptions().timeZone, message: error.message, status: status }
}