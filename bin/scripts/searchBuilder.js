// @ts-nocheck
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseHTML } from 'linkedom';
import { indexSearchData } from './meiliBuilder.js';
import { logWithColor } from './logger.js';

const srcPath = path.join(process.cwd(), 'src');
const distPath = path.join(process.cwd(), 'dist');
const outputFilePath = path.join(process.cwd(), '.vitepress/theme/data/search.json');

const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Scan markdown files to build metadata map (title, category, version)
const getMarkdownMetadata = async () => {
  const metadata = new Map();

  const scanDir = async (dir, version = '') => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory() && !file.name.startsWith('.') && file.name !== 'public') {
        const newVersion = version || file.name;
        await scanDir(fullPath, newVersion);
      } else if (file.name.endsWith('.md')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const parsed = matter(content);

        // Build URL path from file path
        const relativePath = path.relative(srcPath, fullPath);
        let urlPath = '/' + relativePath.replace(/\.md$/, '').replace(/\/index$/, '');
        if (urlPath === '/index') urlPath = '/';

        metadata.set(urlPath, {
          title: parsed.data.title || 'Untitled',
          category: parsed.data.category || 'Uncategorized',
          version: version || relativePath.split(path.sep)[0],
        });
      }
    }
  };

  await scanDir(srcPath);
  return metadata;
};

// Crawl built HTML files and extract content
const crawlHtmlFiles = async (metadata) => {
  const results = [];
  let id = 1;

  const scanDir = async (dir) => {
    if (!fs.existsSync(dir)) {
      throw new Error(`dist directory not found. Run vitepress build first.`);
    }

    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        await scanDir(fullPath);
      } else if (file.name.endsWith('.html')) {
        const html = fs.readFileSync(fullPath, 'utf8');
        const { document } = parseHTML(html);

        // Build URL path from file path
        const relativePath = path.relative(distPath, fullPath);
        let urlPath = '/' + relativePath.replace(/\.html$/, '').replace(/\/index$/, '');
        if (urlPath === '/index') urlPath = '/';

        // Get metadata for this page
        const meta = metadata.get(urlPath) ||
          metadata.get(urlPath + '/') || {
            title: document.querySelector('title')?.textContent || 'Untitled',
            category: 'Uncategorized',
            version: urlPath.split('/').filter(Boolean)[0] || '',
          };

        // Find content container
        const contentEl = document.querySelector('.prose') || document.querySelector('main') || document.body;
        if (!contentEl) continue;

        // Extract sections based on h2 headers
        const headers = contentEl.querySelectorAll('h2');

        headers.forEach((h2) => {
          // Clean header text - remove markdown # symbols and anchor links
          const headerText = (h2.textContent?.trim() || '').replace(/^#+\s*/, '').replace(/\s*#$/, '');
          const slug = h2.id || createSlug(headerText);

          // Collect content until next h2
          let content = '';
          let sibling = h2.nextElementSibling;

          while (sibling && sibling.tagName !== 'H2') {
            // Skip script and style tags
            if (sibling.tagName !== 'SCRIPT' && sibling.tagName !== 'STYLE') {
              content += (sibling.textContent || '') + ' ';
            }
            sibling = sibling.nextElementSibling;
          }

          content = content.replace(/\s+/g, ' ').trim();

          if (headerText && content) {
            results.push({
              id: id++,
              title: meta.title,
              category: meta.category,
              version: meta.version,
              header: headerText,
              slug,
              content,
              url: urlPath + '#' + slug,
            });
          }
        });
      }
    }
  };

  await scanDir(distPath);
  return results;
};

// Main function to generate the index by crawling built HTML
const generateIndex = async () => {
  try {
    logWithColor('Reading markdown frontmatter for metadata...', 'blue');
    const metadata = await getMarkdownMetadata();

    logWithColor('Crawling built HTML files for content...', 'blue');
    const results = await crawlHtmlFiles(metadata);

    const jsonOutput = JSON.stringify(results, null, 2);

    // Write to theme data folder
    fs.writeFileSync(outputFilePath, jsonOutput);

    // Also copy to dist for runtime access
    const distSearchPath = path.join(distPath, 'search.json');
    fs.writeFileSync(distSearchPath, jsonOutput);

    logWithColor(`Indexed ${results.length} sections from HTML.`, 'blue');
    logWithColor('Search index generated successfully.', 'green');

    // Push to Meilisearch if configured
    await indexSearchData();
  } catch (error) {
    logWithColor(`Error generating search index: ${error.message}`, 'red');
  }
};

export { generateIndex };
