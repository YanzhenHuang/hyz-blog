import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { locale } = await request.json();
        if (!locale) {
            return Response.json({ error: 'Locale not provided' }, { status: 400 });
        }

        (await cookies()).set('NEXT_LOCALE', locale, {
            httpOnly: true,
            path: '/',
            maxAge: 30 * 24 * 60 * 60,
        });

        return Response.json({ success: true });
    } catch (e) {
        return Response.json({ error: 'Error setting locale' }, { status: 500 });
     }
}