export class Todo {
    id: number = -1
    task: string = ""
    description: string = ""
    status: Status = Status.OPEN
    author: string = ""
    created_at: Date = new Date()
    last_update: Date = new Date()
}

export enum Status {
    CLOSED="OPEN",
    IN_PROGRESS="IN_PROGRESS",
    OPEN="OPEN"
}