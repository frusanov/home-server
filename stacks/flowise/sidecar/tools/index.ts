import { Hono } from "hono";
import { readdir } from "./readdir";
import { zValidator } from "@hono/zod-validator";
import { Schema, z, type ArrayCardinality } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import type { FunctionTool } from "../types/function";
import { readFile } from "./read-file";

export const tools = new Hono();

const toolsList: Array<FunctionTool> = [readdir, readFile];

tools.get("/", (c) =>
  c.json(
    toolsList.map((tool) => {
      return {
        name: tool.name,
        parameters: zodToJsonSchema(tool.parameters),
      };
    }),
  ),
);

tools.post(
  "/",
  zValidator(
    "json",
    z.union(
      toolsList.map((tool) => {
        return z.object({
          name: z.enum([tool.name]),
          parameters: tool.parameters,
        });
      }),
    ),
  ),
  async (c) => {
    const { name, parameters } = c.req.valid("json");

    const tool = toolsList.find((t) => t.name === name);

    if (!tool) {
      return c.json({}, 404);
    }

    try {
      return c.json({
        tool: tool.name,
        result: (await tool.fn(parameters)) || null,
      });
    } catch (e: any) {
      if (e && e?.code) {
        return c.json(
          {
            tool: tool.name,
            result: e.message,
          },
          e.code,
        );
      }

      return c.json(
        {
          tool: tool.name,
          result: "Internal server error",
        },
        500,
      );
    }
  },
);
