import { readFile as readFileNode } from "node:fs/promises";
import { z } from "zod";
import type { FunctionTool } from "../types/function";
import { ErrorWithCode } from "../utils/error-with-code";

const parametersSchema = z.object({
  path: z.string(),
});

export const readFile: FunctionTool = {
  name: "read_file",
  parameters: parametersSchema,
  fn: async ({ path }: z.infer<typeof parametersSchema>) => {
    try {
      return await readFileNode(path, {
        encoding: "utf8",
      });
    } catch (e: any) {
      if (e && e?.errno === -2) {
        throw new ErrorWithCode("File not found", {
          cause: e,
          code: 404,
        });
      }

      throw e;
    }
  },
};
