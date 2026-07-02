export async function register() {
  console.info(
    "✅ Instrumentation started",
    process.env.NEXT_RUNTIME,
    new Date().toISOString(),
  );

  await import("./env/server");
}
