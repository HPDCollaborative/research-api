// @ts-nocheck
import 'dotenv/config';
import { promises as fs } from 'fs';
import path from 'path';
import siteConfig from '../../.vitepress/config.js';
import { generateVersions } from './versionBuilder.js';
import { generateSidebar } from './sidebarBuilder.js';
import { generateIndex } from './searchBuilder.js';
import { logWithColor } from './logger.js';
import { pullVersions } from './pullVersions.js';

const runPullVersions = async () => {
  if (process.env.REPO_URL && process.env.DOC_VERSIONS) {
    await pullVersions();
  }
};

const runGenerateVersions = async () => {
  const dirPath = path.join(process.cwd(), './src');

  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    const hasOtherDirectories = files.some((dirent) => dirent.isDirectory() && dirent.name !== 'public');

    if (hasOtherDirectories) {
      generateVersions();
    }
  } catch (error) {
    logWithColor(`Error reading the directory: ${error.message}`, 'red');
  }
};

const runGenerateSidebar = async () => {
  await generateSidebar();
};

const runGenerateIndex = async () => {
  if (siteConfig.themeConfig.search.provider === 'meilisearch') {
    if (process.env.SEARCH_HOST && process.env.ADMIN_KEY) {
      await generateIndex();
    } else {
      logWithColor('Either switch your search provider to local or set the required keys in your .env file.', 'red');
    }
  } else {
    await generateIndex();
  }
};

export { runPullVersions, runGenerateVersions, runGenerateSidebar, runGenerateIndex };
