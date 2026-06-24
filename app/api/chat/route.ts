import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        const upstream = await fetch("https://api.docsearch.love/chat", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/event-stream'
            },
            body: JSON.stringify(body),
        });

        // If upstream returned non-OK, forward status and body
        if (!upstream.ok) {
            const text = await upstream.text();
            return new Response(text, {
                status: upstream.status,
                headers: {
                    'Content-Type': upstream.headers.get('content-type') || 'text/plain'
                }
            });
        }

        // Stream the upstream body back to the client
        return new Response(upstream.body, {
            status: upstream.status,
            headers: {
                'Content-Type': upstream.headers.get('content-type') || 'text/event-stream',
            }
        });
    } catch (e) {
        return new Response(JSON.stringify({ error: String(e) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
