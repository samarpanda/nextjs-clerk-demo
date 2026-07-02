import { z } from "zod";

export function createEnv<T extends z.ZodType>(schema: T, values: unknown) {
  const parsed = schema.safeParse(values);

  if (!parsed.success) {
    const { fieldErrors, formErrors } = z.flattenError(parsed.error);
    throw new Error(
      [
        "Invalid environment variables",
        ...formErrors,
        ...Object.entries(fieldErrors).flatMap(([name, messages]) =>
          Array.isArray(messages)
            ? messages.map((message) => `${name}: ${message}`)
            : [],
        ),
      ].join("\n"),
    );
  }

  return parsed.data;
}
