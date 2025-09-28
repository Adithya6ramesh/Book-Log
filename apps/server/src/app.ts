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
    try {
      return await auth.handler(c.req.raw);
    } catch (error) {
      console.error("Auth handler error:", error);
      return c.json({ error: "Authentication error" }, 500);
    }
  })
  .get("/", async (c) => {
    // If this is hit with a session (likely from OAuth), redirect to frontend
    const user = c.get("user");
    const acceptHeader = c.req.header("accept");
    
    // If user is authenticated and this looks like a browser request, redirect to frontend
    if (user && acceptHeader && acceptHeader.includes("text/html")) {
      return c.redirect(env.WEB_URL);
    }
    
    return c.json({ message: "Book Log API - Welcome!" });
  })
  .route("/books", booksRouter);

export default app;

export type AppType = typeof app;
