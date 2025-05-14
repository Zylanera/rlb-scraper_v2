const { PrismaClient } = require('@prisma/client');
const { Parser } = require('json2csv');
const fs = require('fs');

const prisma = new PrismaClient();

async function exportToCSV() {
  const products = await prisma.product.findMany();

  const fields = ['id', 'laufzeit', 'zinssatz', 'variante', 'bild', 'strecke', 'bankBlz'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(products);

  fs.writeFileSync('products.csv', csv);
  console.log('CSV exportiert als products.csv');
}

exportToCSV();

const ExcelJS = require('exceljs');
async function exportToExcel() {
  const products = await prisma.product.findMany();

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Produkte');

  worksheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Laufzeit', key: 'laufzeit', width: 15 },
    { header: 'Zinssatz', key: 'zinssatz', width: 10 },
    { header: 'Variante', key: 'variante', width: 15 },
    { header: 'Bild', key: 'bild', width: 10 },
    { header: 'Strecke', key: 'strecke', width: 15 },
    { header: 'BankBLZ', key: 'bankBlz', width: 15 }
  ];

  products.forEach(product => {
    worksheet.addRow(product);
  });

  await workbook.xlsx.writeFile('products.xlsx');
  console.log('Excel exportiert als products.xlsx');
}

exportToExcel();
