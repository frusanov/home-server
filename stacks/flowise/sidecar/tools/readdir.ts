import { readdir as readdirNode } from "node:fs/promises";
import { z } from "zod";
import type { FunctionTool } from "../types/function";

const parametersSchema = z.object({
  path: z.string(),
});

export const readdir: FunctionTool = {
  name: "readdir",
  parameters: parametersSchema,
  fn: async ({ path }: z.infer<typeof parametersSchema>) => {
    return await readdirNode(path);
  },
};
