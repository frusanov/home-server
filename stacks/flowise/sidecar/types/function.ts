import type { ZodSchema } from "zod";

export interface FunctionTool<T = any, P = any> {
  name: string;
  fn: (params: P) => Promise<T>;
  parameters: ZodSchema<P>;
}
