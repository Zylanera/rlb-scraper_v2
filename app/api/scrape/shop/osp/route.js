import { chromium } from 'playwright';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


async function getBanks() {
  try {
    const banks = await prisma.bank.findMany();
    return banks;
  } catch (error) {
    console.error('Fehler beim Abrufen der Bankdaten:', error);
    throw new Error('Fehler beim Abrufen der Bankdaten');
  }
}

export async function POST(req) {
  try {
    // Scraping-Funktion hier aufrufen
    await scrapeZinsen();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error('Fehler beim Scraping:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Fehler beim Scraping' }),
      { status: 500 }
    );
  }
}

async function scrapeZinsen() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const banken = await getBanks();

  for (const bank of banken) {
    try {
      console.log(`🔄 Lade Sparprodukte für ${bank.blz}: ${bank.name}...`);
      await page.goto("https://shop.raiffeisenbank.at/Online-Produkte/Online-Sparen?companyBusinessId=" + bank.blz, { waitUntil: "networkidle", timeout: 600000 });
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(5000);

      const produkte = await page.$$(".list-complete-item");

      for (const produkt of produkte) {
        const bgImage = await produkt.$eval(".offer-box-img", el =>
          window.getComputedStyle(el).getPropertyValue("background-image")
        );
        const bildVorhanden = !bgImage.includes("null");

        let laufzeit = await produkt.$$eval(
          "h3, .product-title, .laufzeit, .term",
          elements => {
            for (const el of elements) {
              const text = el.textContent.trim();
              if (/täglich fällig|tagesgeld/i.test(text)) return "Taeglich faellig";
              const match = text.match(/(\d+)\s*(Monate?|Jahre?|Tage?)/i);
              if (match) return `${match[1]} ${match[2]}`;
            }
            return null;
          }
        );

        if (!laufzeit) {
          laufzeit = await produkt.$$eval(".product-highlight", elements => {
            for (const el of elements) {
              const text = el.textContent.trim();
              const match = text.match(/(\d+)\s*(Monate?|Jahre?|Tage?)/i);
              if (match) return `${match[1]} ${match[2]}`;
            }
            return null;
          });
        }

        laufzeit = laufzeit || "Unbekannt";

        const zinssatzStr = await produkt.$$eval(
          ".product-highlight, .zins-text, .zinssatz",
          elements => {
            for (const el of elements) {
              const text = el.textContent.trim();
              const match = text.match(/(\d+[,\.]\d+)\s*%/);
              if (match) return match[1].replace(",", ".");
            }
            return null;
          }
        );
        const zinssatz = zinssatzStr ? parseFloat(zinssatzStr) : 0;

        let variante = "Fix";
        if (laufzeit === "Taeglich faellig") variante = "Taeglich faellig";
        else if (laufzeit === "Unbekannt") variante = zinssatz <= 0.5 ? "Taeglich faellig" : "Fix";

        let streckenStatus = "Unbekannt";
        try {
          const linkElement = await produkt.$("a.btn.btn-primary");
          if (linkElement) {
            const link = await linkElement.getAttribute("href");
            if (link) {
              const fullLink = link.startsWith("http") ? link : `https://antrag.raiffeisenbank.at${link}`;
              const detailPage = await browser.newPage();
              await detailPage.goto(fullLink, { waitUntil: "domcontentloaded", timeout: 15000 });
              await detailPage.waitForTimeout(3000);
              const headlineText = await detailPage.$eval(".wf-headline", el => el.textContent.trim()).catch(() => null);
              streckenStatus = headlineText && /produktauswahl/i.test(headlineText.toLowerCase())
                ? "Verfuegbar"
                : "Streckenfehler";
              await detailPage.close();
            } else {
              streckenStatus = "Kein Link";
            }
          } else {
            streckenStatus = "Kein Button";
          }
        } catch (err) {
          console.error("⚠️ Fehler beim Strecken-Check:", err);
          streckenStatus = "Check nicht möglich";
        }

        await prisma.product.create({
          data: {
            laufzeit,
            zinssatz,
            variante,
            bild: bildVorhanden,
            strecke: streckenStatus,
            bankBlz: bank.blz,
          },
        });


        console.log(`>> Produkt gespeichert: ${laufzeit} | ${zinssatz}% | ${variante} | ${bildVorhanden} | ${streckenStatus} `);
      }

      await page.waitForTimeout(2000);
    } catch (error) {
      console.error(`❌ Fehler bei ${bank.name}:`, error);
      await page.waitForTimeout(10000);
    }
  }

  await browser.close();
  console.log("✅ Scraping abgeschlossen und gespeichert.");
}
