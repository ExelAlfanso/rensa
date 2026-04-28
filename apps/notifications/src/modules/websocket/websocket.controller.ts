import { jwt } from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { env } from "../../config/env";
import { WebSocketService } from "./websocket.service";

export const websocketController = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: env.jwtSecret,
    })
  )
  .ws("/ws", {
    query: t.Object({
      token: t.String(),
    }),
    data: {
      userId: "" as string,
    },
    open: WebSocketService.open,
    close: WebSocketService.close,
  });

