import { zValidator } from "@hono/zod-validator";
import { createNotesSchema } from "@repo/validators";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { type HonoAppContext } from "../auth";
import { db } from "../db/index";
import * as schema from "../db/schema";
import { withAuth } from "../middlewares/auth.middleware";
export const notes = new Hono<HonoAppContext>()
  .get("/", async (c) => {
    // By default if there is no withAuth middleware passed, the user can either be null or defined
    const user = c.var.user;

    let notes = (
      await db.query.note.findMany({
        columns: {
          content: true,
          createdAt: true,
          title: true,
          id: true,
        },
        with: {
          user: {
            columns: {
              id: true,
              name: true,
            },
          },
        },
      })
    ).map(({ user, ...note }) => ({
      ...note,
      isOwner: user.id === user?.id,
      creatorName: user.name,
    }));

    return c.json(notes, 200);
  })
  .post("/", zValidator("json", createNotesSchema), withAuth, async (c) => {
    // However here since we have withAuth middleware, the user is always garaunteed to be defined
    const user = c.var.user;

    const { title, content } = await c.req.valid("json");

    const note = await db
      .insert(schema.note)
      .values({
        title,
        content,
        userId: user.id,
      })
      .returning();

    return c.json(note, 200);
  })
  .get("/:id", async (c) => {
    const { id } = c.req.param();

    const note = await db.query.note.findFirst({
      where: eq(schema.note.id, Number(id)),
    });

    return c.json(note, 200);
  });
