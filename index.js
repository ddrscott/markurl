const express = require('express');
const { chromium } = require('playwright');
const TurndownService = require('turndown');
const app = express();
const port = process.env.PORT || 8080;
const turndownService = new TurndownService();

let browser; // Declare browser variable in the outer scope

async function launchBrowser() {
    browser = await chromium.launch();
}

app.get('/:format/:selector/*', async (req, res) => {
    console.log(`processing request for ${req.params[0]}, ${req.params.selector}, ${req.params.format}`);
    const { format, selector } = req.params;
    const url = `https://${req.params[0]}`;
    if (!url) {
        return res.status(400).send('URL is required');
    }
    const page = await browser.newPage();
    try {
        await page.goto(url);
        const element = await page.$(selector);
        if (!element) {
            await browser.close();
            return res.status(404).send(`No element found with selector: ${selector}`);
        }
        if (format === 'markdown') {
            const htmlContent = await element.evaluate(el => el.outerHTML);
            const markdown = turndownService.turndown(htmlContent);
            res.setHeader('Content-Type', 'text/markdown');
            res.send(markdown);
        } else if (format === 'html') {
            const content = await element.evaluate(el => el.outerHTML);
            res.setHeader('Content-Type', 'text/html');
            res.send(content);
        } else {
            res.status(400).send('Invalid format specified. Use "markdown" or "html".');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error fetching page: ${error.message}\n${error.stack}`);
    } finally {
        try {
            await page.close();
        } catch (e) {
            console.log(`Ignoring error closing the page: ${e}`);
        }
    }
});

app.listen(port, async () => {
    await launchBrowser(); // Launch the browser when the server starts
    console.log(`Server running at http://localhost:${port}`);
});
