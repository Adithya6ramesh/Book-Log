import { Hono } from "hono";

import { cors } from "hono/cors";
import { env } from "../env";
import { auth, type HonoAppContext } from "./auth";
import { booksRouter } from "./routes/books";

const app = new Hono<HonoAppContext>()
  // ------------------------------------------------------------
  // CORS
  // ------------------------------------------------------------
  .use("*", async (c, next) => {
    console.log("Middleware hit for", c.req.path, "from origin", c.req.header("origin"));
    await next();
  })
  .use(
    "*",
    cors({
      origin: ["http://localhost:5173", "http://localhost:8080"],
      allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
      allowMethods: ["POST", "GET", "PUT", "DELETE", "OPTIONS"],
      exposeHeaders: ["Content-Length", "Set-Cookie"],
      maxAge: 600,
      credentials: true,
    })
  )
  // ------------------------------------------------------------
  // AUTH
  // ------------------------------------------------------------
  .use("*", async (c, next) => {
    try {
      const session = await auth.api.getSession({ headers: c.req.raw.headers });
      console.log("Session check for", c.req.path, ":", session ? "has session" : "no session");

      if (!session) {
        c.set("user", null);
        c.set("session", null);
        return next();
      }

      c.set("user", session.user);
      c.set("session", session.session);
      return next();
    } catch (error) {
      console.error("Session middleware error:", error);
      c.set("user", null);
      c.set("session", null);
      return next();
    }
  })
  .on(["POST", "GET"], "/api/auth/*", async (c) => {
    console.log("Auth route hit:", c.req.path);
    console.log("Request method:", c.req.method);
    console.log("Request headers:", Object.fromEntries(c.req.raw.headers.entries()));
    console.log("Request URL:", c.req.url);
    try {
      console.log("Calling auth.handler...");
      const result = await auth.handler(c.req.raw);
      console.log("Auth handler result:", result);
      return result;
    } catch (error) {
      console.error("Auth handler error:", error);
      return c.json({ error: "Authentication error" }, 500);
    }
  })
  .get("/", (c) => c.json({ message: "Book Log API - Welcome!" }))
  .route("/books", booksRouter);

export default app;

export type AppType = typeof app;
