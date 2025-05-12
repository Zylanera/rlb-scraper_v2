import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export async function GET() {
  try {
    const banks = await prisma.bank.findMany()
    return new Response(JSON.stringify(banks), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Fehler beim Laden der Bankdaten' }),
      { status: 500 }
    )
  }
}