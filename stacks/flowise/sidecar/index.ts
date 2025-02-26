import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { tools } from "./tools";

const app = new Hono();

app.route("/tools", tools);

serve({
  port: 3322,
  fetch: app.fetch,
});
