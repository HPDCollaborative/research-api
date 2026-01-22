// @ts-nocheck
import { logWithColor } from './scripts/logger.js';
import { runPullVersions, runGenerateVersions, runGenerateSidebar } from './scripts/runner.js';

async function setupDocs() {
  try {
    await runPullVersions();
    await runGenerateVersions();
    await runGenerateSidebar();

    logWithColor('Setup completed successfully.', 'green');
    logWithColor('Run "bun run build" to generate the search index.', 'blue');
  } catch (error) {
    logWithColor(`Error during setup: ${error.message}`, 'red');
  }
}

setupDocs();
