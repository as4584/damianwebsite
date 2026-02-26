import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL('/dashboard/api/analytics', request.url);
  const res = await fetch(url, {
    headers: {
      cookie: request.headers.get('cookie') ?? '',
      authorization: request.headers.get('authorization') ?? '',
    },
    cache: 'no-store',
  });

  const body = await res.text();
  return new NextResponse(body, {
    status: res.status,
    headers: {
      'content-type': res.headers.get('content-type') ?? 'application/json',
      'cache-control': 'no-store',
    },
  });
}
