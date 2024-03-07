const express = require('express');
const { chromium } = require('playwright');
const TurndownService = require('turndown');
const app = express();
const port = process.env.PORT || 8080;
const turndownService = new TurndownService();

const { JSDOM } = require('jsdom');
const { Readability } = require('@mozilla/readability');

let browser; // Declare browser variable in the outer scope

async function launchBrowser() {
    browser = await chromium.launch();
}

async function extractMainContentWithReadability(page) {
    console.log('Extracting main content with Readability');
    // Fetch the page HTML content
    const htmlContent = await page.content();
    // Create a JSDOM instance with the fetched HTML content
    const dom = new JSDOM(htmlContent, {
        url: page.url(),
    });
    // Apply the Readability algorithm
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    return article.content;
}

app.get('/:format/:selector/*', async (req, res) => {
    console.log(`GET ${req.params[0]}, ${req.params.selector}, ${req.params.format}`);
    const { format, selector } = req.params;
    const url = `https://${req.params[0]}`;
    if (!url) {
        return res.status(400).send('URL is required');
    }
    const page = await browser.newPage();
    try {
        await page.goto(url);
        await page.waitForLoadState('networkidle');
        if (format === 'markdown') {
            let htmlContent;
            if (selector === 'read') {
                htmlContent = await extractMainContentWithReadability(page);
            } else {
                const element = await page.$(selector);
                if (!element) {
                    return res.status(404).send(`No element found with selector: ${selector}`);
                }
                htmlContent = await element.evaluate(el => el.outerHTML);
            }
            const markdown = turndownService.turndown(htmlContent);
            res.setHeader('Content-Type', 'text/markdown');
            res.send(markdown);
        } else if (format === 'html') {
            const element = await page.$(selector);
            if (!element) {
                return res.status(404).send(`No element found with selector: ${selector}`);
            }
            const content = await element.evaluate(el => el.outerHTML);
            res.setHeader('Content-Type', 'text/html');
            res.send(content);
        } else if (format === 'png') {
            const screenshotBuffer = await page.screenshot({fullPage: true });
            res.setHeader('Content-Type', 'image/png');
            res.send(screenshotBuffer);
        } else {
            res.status(400).send('Invalid format specified. Use "markdown", "html", or "png".');
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
