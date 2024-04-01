import fs from 'fs';
import https from 'https';
import siteConfig from '../../.vitepress/config.js';
import { MeiliSearch } from 'meilisearch';
import { logWithColor } from './logger.js';

async function indexSearchData() {
  if (siteConfig.themeConfig.search.provider !== 'meilisearch') {
    return;
  }

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  });

  const client = new MeiliSearch({
    host: process.env.SEARCH_LOCAL,
    apiKey: process.env.SEARCH_KEY,
    httpsAgent,
  });

  try {
    const indexName = process.env.INDEX_NAME;
    const index = client.index(indexName);

    const data = JSON.parse(fs.readFileSync('.vitepress/theme/data/search.json', 'utf8'));

    try {
      const response = await index.addDocuments(data);
      logWithColor(`Task #${response.taskUid} has been ${response.status}.`, 'green');
    } catch (subError) {
      logWithColor(`An unexpected response was received from Meilisearch: ${subError.message}`, 'red');
    }
  } catch (error) {
    logWithColor(error.message, 'red');
  }
}

export { indexSearchData };
