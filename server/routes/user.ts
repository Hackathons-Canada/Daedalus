import { Hono } from "hono";

import { getUserById } from "@/lib/db/queries/user";

export const app = new Hono();

// Routes for /api/user/<route>

// /api/user/:id
app.get("/:id", async (c) => {
  // TODO: error handling
  const id = Number.parseInt(c.req.param("id"));
  const user = await getUserById(id);

  if (!user) {
    return c.text(`No user found with id ${id}`);
  }

  return c.text(
    `Hello from a single user route with id ${id} - username: ${user.username}!`,
  );
});

export const userRoutes = app;
