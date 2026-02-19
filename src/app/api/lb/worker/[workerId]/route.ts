const inFlight = new Map<string, number>();

const DURATIONS: Record<string, [number, number]> = {
  ping: [150, 300],
  image_resize: [1200, 1800],
  ml_inference: [3000, 5000],
  batch_export: [6000, 9000],
  db_migration: [500, 8000],
};

const MAX_IN_FLIGHT = 4;

function randBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ workerId: string }> }
) {
  const { workerId } = await params;
  const body = await request.json();
  const { taskId, type } = body as { taskId: string; type: string };

  const current = inFlight.get(workerId) ?? 0;
  if (current >= MAX_IN_FLIGHT) {
    return Response.json(
      { error: "overloaded", worker: `worker-${workerId}`, taskId },
      { status: 503 }
    );
  }

  inFlight.set(workerId, current + 1);

  const [min, max] = DURATIONS[type] ?? [500, 1500];
  const processingMs = randBetween(min, max);
  const startedAt = Date.now();

  await sleep(processingMs);

  const count = inFlight.get(workerId) ?? 1;
  inFlight.set(workerId, Math.max(0, count - 1));

  return Response.json({
    taskId,
    worker: `worker-${workerId}`,
    processingMs: Date.now() - startedAt,
    completedAt: Date.now(),
    queueDepth: Math.max(0, count - 1),
  });
}
