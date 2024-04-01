// Import necessary modules
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import matter from 'gray-matter';
import { indexSearchData } from './meiliBuilder.js';
import { logWithColor } from './logger.js';

// Promisify fs methods
const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// File and directory paths
const srcPath = path.join(process.cwd(), 'src');
const outputFilePath = path.join(process.cwd(), '.vitepress/theme/data/search.json');
const configFilePath = path.join(process.cwd(), '.vitepress/config.js');

// Helper functions
const isMarkdownFile = (file) => file.endsWith('.md');
const createSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove punctuation and special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, and hyphens with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
};

// Function to process and clean the content
const processContent = (content) => {
  let cleanedContent = content
    .replace(/\[\[toc\]\]\n+/g, '') // Remove [[toc]] and following newlines
    .replace(/\{\{[^}]*\}\}/g, '') // Remove {{ }} content
    .replace(/\{[^}]*\}/g, '') // Remove { } content
    .replace(/^#+\s*/gm, '') // Remove Markdown heading symbols
    .replace(/:::.*?:::/gs, '') // Remove triple colon containers and their content
    .replace(/^>\s*\[!.+$(.*?^>.*$)*/gm, '') // Remove GitHub-style containers
    .replace(/````?.*?````?/gs, '') // Remove code blocks enclosed in 3 or 4 backticks
    .replace(/<[^>]+\/>/gs, '') // Remove self-closing Vue component tags
    .replace(/<[^>]+>.*?<\/[^>]+>/gs, '') // Remove Vue component opening and closing tags and their content
    .trim(); // Remove leading and trailing whitespace including newlines

  return cleanedContent;
};

// Function to extract sections from markdown content
const extractSections = (content, filePath, cleanUrls) => {
  const headerRegex = /^## (.+?)\s*(?:\{\..*?\})?$/gm;
  let match;
  const sections = [];
  let lastPos = 0;

  while ((match = headerRegex.exec(content)) !== null) {
    const startPos = content.indexOf('\n', match.index) + 1;
    const endPos = content.indexOf('\n## ', startPos);
    const header = match[1].trim();
    const slug = createSlug(header);
    const rawSectionContent = content.substring(startPos, endPos > 0 ? endPos : undefined).trim();
    const sectionContent = processContent(rawSectionContent);
    const url = cleanUrls ? '/' + filePath.replace(/\.md$/, '') + '#' + slug : '/' + filePath + '.html#' + slug;

    sections.push({
      header,
      slug,
      content: sectionContent,
      url: url,
    });
  }

  return sections;
};

// Process directory recursively
const processDirectory = async (dir, results = [], cleanUrls) => {
  const directoryPath = path.join(srcPath, dir);
  const files = await readdir(directoryPath, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      await processDirectory(path.join(dir, file.name), results, cleanUrls);
    } else if (isMarkdownFile(file.name)) {
      const filePath = path.join(directoryPath, file.name);
      const content = await readFile(filePath, 'utf8');
      const parsed = matter(content);
      const sections = extractSections(parsed.content, path.join(dir, file.name), cleanUrls);

      sections.forEach((section, index) => {
        results.push({
          id: results.length + 1,
          title: parsed.data.title || 'Untitled',
          category: parsed.data.category || 'Uncategorized',
          version: dir.split(path.sep)[0],
          ...section,
        });
      });
    }
  }

  return results;
};

// Main function to generate the index
const generateIndex = async () => {
  try {
    const vitepressConfig = await import(configFilePath);
    const cleanUrls = vitepressConfig.default.cleanUrls || false;
    const searchProvider = vitepressConfig.default.themeConfig.search.provider;

    const results = await processDirectory('.', [], cleanUrls);
    await writeFile(outputFilePath, JSON.stringify(results, null, 2));
    logWithColor(`Indexed ${results.length} sections.`, 'blue');
    logWithColor('Search index generated successfully.', 'green');

    if (searchProvider === 'meilisearch') {
      indexSearchData();
    }
  } catch (error) {
    logWithColor(`Error generating search index: ${error.message}`, 'red');
  }
};

// Export the main function
export { generateIndex };
