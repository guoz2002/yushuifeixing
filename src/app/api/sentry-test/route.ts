import * as Sentry from "@sentry/nextjs";

export async function GET() {
  try {
    const fn = (globalThis as { myUndefinedFunction?: () => unknown }).myUndefinedFunction;
    fn?.();
  } catch {
    // ignore and continue with an explicit test error below
  }

  const error = new Error("Sentry server test error from /api/sentry-test");
  const eventId = Sentry.captureException(error);
  await Sentry.flush(2000);

  return Response.json(
    {
      ok: false,
      message: "Sentry test error captured",
      eventId,
    },
    { status: 500 },
  );
}
