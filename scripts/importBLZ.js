// scripts/importBanks.js
import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function run() {
  const filePath = path.join(process.cwd(), 'lib', 'bank', 'clients.json')
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

  for (const bank of data) {
    await prisma.bank.upsert({
      where: { blz: bank.BLZ },
      update: {},
      create: {
        blz: bank.BLZ,
        name: bank.Bank,
        urlPath: bank.URLpath
      }
    })
  }

  console.log('✅ Banken importiert.')
}

run()
