import puppeteer from 'puppeteer';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: 'Email and password are required' }, { status: 400 });
  }

  const browser = await puppeteer.launch({ headless: false, args: ['--no-sandbox'] });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const ordersURL = 'https://www.amazon.in/your-orders/orders?timeFilter=year-2025';

    // Go to orders page
    await page.goto(ordersURL, { waitUntil: 'networkidle2' });

    // If redirected to login
    if (page.url().includes('/ap/signin')) {
      console.log('Not logged in. Performing login...');

      await page.type('#ap_email', email);
      await page.click('#continue');

      await page.waitForSelector('#ap_password', { timeout: 10000 });
      await page.type('#ap_password', password);
      await page.click('#signInSubmit');

      console.log('Waiting for CAPTCHA/MFA if any...');
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

      // Go back to orders
      await page.goto(ordersURL, { waitUntil: 'networkidle2' });
    }

    let hasNext = true;
    const allHtml = [];
    let pageNum = 1;

    while (hasNext) {
      console.log(`Scraping orders page ${pageNum}...`);

      try {
        await page.waitForSelector('.order-card__list', { timeout: 15000 });
      } catch {
        console.warn(`.order-card__list not found on page ${pageNum}`);
        break;
      }

      const htmlBlocks = await page.evaluate(() => {
        const nodes = document.querySelectorAll('.order-card__list');
        return Array.from(nodes).map(node => node.outerHTML);
      });

      allHtml.push(...htmlBlocks);

      // Check for pagination button
      const nextButton = await page.$('ul.a-pagination li.a-last a');
      if (nextButton) {
        await Promise.all([
          page.waitForNavigation({ waitUntil: 'networkidle2' }),
          nextButton.click()
        ]);
        pageNum++;
      } else {
        hasNext = false;
      }
    }

    await browser.close();
    return Response.json({ totalPages: pageNum, count: allHtml.length, orderHtmlBlocks: allHtml }, { status: 200 });

  } catch (error) {
    await browser.close();
    console.error('Scraping error:', error.message);
    return Response.json({ error: 'Something went wrong', details: error.message }, { status: 500 });
  }
}
