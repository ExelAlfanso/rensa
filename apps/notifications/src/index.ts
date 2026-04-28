import Elysia from "elysia";
import cors from "@elysiajs/cors";
import { env } from "./config/env";
import { connectDatabase } from "./database";
import { apiController } from "./modules";

await connectDatabase();

export const app = new Elysia()
  .use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/health", () => ({ status: "ok" }))
  .use(apiController)
  .listen({ port: env.port }, () =>
    console.log(`Server is running on http://localhost:${env.port}`)
  );
