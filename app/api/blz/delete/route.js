import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req, res) {
    const { blz } = await req.json();

    try {
        await prisma.bank.delete({
            where: { blz: blz },
        });
        return new Response(JSON.stringify({ message: 'Bank gelöscht' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200,
        });
    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({ error: 'Fehler beim Löschen der Bankdaten' }), {
            status: 500,
        });
    }
}
