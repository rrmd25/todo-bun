import Elysia from "elysia"

export class ResourceNotFoundError extends Error {
    constructor(public message: string) {
        super(message)
    }
}

