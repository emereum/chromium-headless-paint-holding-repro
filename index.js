const puppeteer = require('puppeteer');
const express = require('express');

const app = express();
app.use(express.static('public'));
const server = app.listen(3000);

async function captureFirstPaint(url, opts) {
    let browser;
    let page;
    try {
        browser = await puppeteer.launch({
            waitForInitialPage: true,
            ...opts
        });
        page = (await browser.pages())[0];
        await page.setCacheEnabled(false);
        await page.goto(url);
        await page.waitForSelector('#third-element', { visible: true });
        const result = await page.evaluate(() => performance.getEntriesByType("paint").map(({ name, startTime }) => ({ name, startTime })));
        return result;
    } finally {
        await page?.close();
        await browser?.close();
    }
}

(async () => {
    const url = `http://localhost:3000`
    const headedResult = await captureFirstPaint(url, { headless: false });
    const headlessResult = await captureFirstPaint(url, { headless: 'new' });
    console.log(JSON.stringify({ headedResult, headlessResult }, null, 2));
    if (headlessResult[0].startTime !== headlessResult[1].startTime) {
        console.error("Test failed. FP and FCP differ in headless mode.");
    }
    server.close();
})();