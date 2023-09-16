import Elysia from "elysia"
import { ResourceNotFoundError } from "./error"
import { createErrorJsonResponse } from "../util/util"

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

