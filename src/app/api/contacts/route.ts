export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;

  if (!apiUrl) {
    return Response.json({ error: 'Contacts API is not configured' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const name = body?.name;
  const email = body?.email;
  const message = body?.message;

  if (!name || !email || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const res = await fetch(`${apiUrl}/contacts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey ?? '',
    },
    body: JSON.stringify({ name, email, message }),
  });

  if (!res.ok) {
    return Response.json({ error: `Upstream request failed with status ${res.status}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
