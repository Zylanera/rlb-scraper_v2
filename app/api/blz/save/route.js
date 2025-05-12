import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req, res) {
    const { blz, name, urlPath } = await req.json();

    try {
        await prisma.bank.upsert({
            where: { blz: blz },
            update: { name: name, urlPath: urlPath },
            create: { blz: blz, name: name, urlPath: urlPath },
        });
        return new Response(JSON.stringify({ message: 'Bank gespeichert' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Fehler beim Speichern der Bankdaten' }), {
            status: 500,
        });
    }
}
