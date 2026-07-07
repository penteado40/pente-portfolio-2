export async function POST(request: Request) {
  const apiUrl = process.env.API_URL;
  const apiKey = process.env.API_KEY;

  if (!apiUrl) {
    return Response.json({ error: 'Testimonials API is not configured' }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const author = body?.author;
  const roleCompany = body?.roleCompany;
  const message = body?.message;

  if (!author || !roleCompany || !message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const res = await fetch(`${apiUrl}/testimonials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey ?? '',
    },
    body: JSON.stringify({ author, roleCompany, message }),
  });

  if (!res.ok) {
    return Response.json({ error: `Upstream request failed with status ${res.status}` }, { status: 502 });
  }

  return Response.json({ ok: true });
}
