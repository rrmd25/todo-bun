import Elysia from "elysia";
import { ElysiaWS, ElysiaWSContext } from "elysia/ws";

export const socketPool = new Elysia()
    .state("socketPool", {} as Record<string, ElysiaWS<ElysiaWSContext<any>>>)
