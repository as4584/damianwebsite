import { NextResponse } from 'next/server';

/**
 * Health check endpoint for CI/CD pipelines
 * 
 * This endpoint ensures the Next.js server is fully initialized
 * before E2E tests begin execution.
 * 
 * Returns 200 OK when:
 * - Server is running
 * - App is initialized
 * - Ready to accept requests
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'innovation-business-services',
      ready: true,
      environment: process.env.NODE_ENV
    },
    { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    }
  );
}
