import { Hono } from "hono";
import { tools } from "./tools";

const app = new Hono();

app.route("/tools", tools);

export default {
  port: 3322,
  fetch: app.fetch,
};
