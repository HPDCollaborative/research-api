// @ts-nocheck
import fs from 'fs';
import siteConfig from '../../.vitepress/config.js';
import { MeiliSearch } from 'meilisearch';
import { logWithColor } from './logger.js';

async function indexSearchData() {
  if (siteConfig.themeConfig.search.provider !== 'meilisearch') {
    return;
  }

  const client = new MeiliSearch({
    host: process.env.SEARCH_HOST,
    apiKey: process.env.ADMIN_KEY,
  });

  try {
    const indexName = process.env.INDEX_NAME;
    const index = client.index(indexName);

    const data = JSON.parse(fs.readFileSync('.vitepress/theme/data/search.json', 'utf8'));

    try {
      const response = await index.deleteAllDocuments();
      logWithColor(`Task #${response.taskUid} has been ${response.status}.`, 'green');
    } catch (delError) {
      logWithColor(`Delete error: ${delError.message}`, 'red');
      if (delError.cause) logWithColor(`Cause: ${JSON.stringify(delError.cause)}`, 'red');
      if (delError.code) logWithColor(`Code: ${delError.code}`, 'red');
    }

    try {
      const response = await index.addDocuments(data);
      logWithColor(`Task #${response.taskUid} has been ${response.status}.`, 'green');
    } catch (subError) {
      logWithColor(`Add error: ${subError.message}`, 'red');
      if (subError.cause) logWithColor(`Cause: ${JSON.stringify(subError.cause)}`, 'red');
      if (subError.code) logWithColor(`Code: ${subError.code}`, 'red');
    }
  } catch (error) {
    logWithColor(error.message, 'red');
  }
}

export { indexSearchData };
