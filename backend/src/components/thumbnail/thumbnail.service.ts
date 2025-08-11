import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';

export const captureVideoThumbnail = async (url: string, outputDir?: string): Promise<string> => {
    const defaultDir = path.resolve(__dirname, '../../thumbnails');
    const saveDir = outputDir || defaultDir;

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();

    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForSelector('video', { timeout: 15000 });
        await page.evaluate(() => {
            const video = document.querySelector('video');
            if (video && video.paused) {
                video.play();
            }
        });

        await new Promise((resolve) => setTimeout(resolve, 2000));

        const videoElement = await page.$('video');
        if (!videoElement) {
            throw new Error('No video element found');
        }

        if (!fs.existsSync(saveDir)) {
            fs.mkdirSync(saveDir, { recursive: true });
        }

        const fileName = `youtube_thumbnail_${Date.now()}.png`;
        const filePath = path.join(saveDir, fileName);
        await videoElement.screenshot({ path: filePath as `${string}.png` });

        await browser.close();
        return filePath;
    } catch (err) {
        await browser.close();
        throw err;
    }
};
