import { z } from "zod";

export function createEnv<T extends z.ZodType>(
  schema: T,
  values: unknown,
): z.output<T> {
  const result = schema.safeParse(values);

  if (result.success) {
    return result.data;
  }

  const details = result.error.issues.map((issue) => {
    const path =
      issue.path.length > 0 ? issue.path.map(String).join(".") : "<root>";

    return `- ${path}: ${issue.message}`;
  });

  throw new Error(["Invalid environment variables:", ...details].join("\n"), {
    cause: result.error,
  });
}
