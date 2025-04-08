import puppeteer from 'puppeteer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get('keyword');

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'Keyword is required' }), {
      status: 400,
    });
  }

  const url = `https://www.google.com/search?&q=${encodeURIComponent(keyword)}&tbm=shop`;

  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const products = await page.evaluate(() => {
      const items = Array.from(document.querySelectorAll('.sh-dgr__grid-result'));
      return items.map(item => {
        const title = item.querySelector('.tAxDx')?.innerText;
        const price = item.querySelector('.a8Pemb')?.innerText;
        const link = item.querySelector('a')?.href;
        const store = item.querySelector('.aULzUe')?.innerText;
        const image = item.querySelector('img')?.src;

        return { title, price, link, store, image };
      });
    });

    await browser.close();

    return new Response(JSON.stringify({ keyword, results: products }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Scraping failed:', error);
    return new Response(JSON.stringify({ error: 'Failed to scrape data' }), {
      status: 500,
    });
  }
}
