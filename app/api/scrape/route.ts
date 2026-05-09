import { NextResponse } from 'next/server';
import { logSystem, LogLevel } from '@/lib/logger';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    await logSystem(LogLevel.INFO, `Starting scrape for: ${url}`, "SCRAPER");

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove unwanted elements
    $('script, style, nav, footer, header, ads, .ads, #ads').remove();

    const title = $('title').text() || $('h1').first().text() || 'Scraped Content';
    
    // Attempt to find main content
    let contentHtml = $('article').html() || $('main').html() || $('body').html() || '';
    
    const turndown = new TurndownService();
    const markdown = turndown.turndown(contentHtml);

    return NextResponse.json({
      success: true,
      title,
      content: markdown,
      url
    });

  } catch (error: any) {
    await logSystem(LogLevel.ERROR, `Scrape failed: ${error.message}`, "SCRAPER", { url: "" });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
