//import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';

import puppeteer from 'puppeteer';
import chromium from "@sparticuz/chromium";

export const generatePdfFromHtml = async (html) => {

    const isVercel = !!process.env.VERCEL;

    let browser;

    try {
        browser = isVercel 
        ? await puppeteer.launch({
            args: chromium.args,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
            defaultViewport: chromium.defaultViewport,
        }) : await puppeteer.launch({
            executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", //desactivar a conveniencia, es la ruta hacia el navegador por si no lo detecta automaticamente
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox"
            ]
        })

        console.log("Browser launched");
    }
    catch (err) {
        console.error("Launch error:");
        console.error(err);
        throw err;
    }

    // Chromium is only to deploy on vercel.
    /*const browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
    });*/

    // Launch the browser and open a new blank page.
    //const browser = await puppeteer.launch();

    try {

        const page = await browser.newPage();

        await page.setContent(html, {
            waitUntil: 'networkidle0'
        });

        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,

            margin: {
                top: '15mm',
                right: '15mm',
                bottom: '15mm',
                left: '15mm'
            },

            preferCSSPageSize: true
        });

        return pdf;

    } finally {
        await browser.close();
    }
};