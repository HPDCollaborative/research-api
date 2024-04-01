import { logWithColor } from './scripts/logger.js';
import { runPullVersions, runGenerateVersions, runGenerateSidebar, runGenerateIndex } from './scripts/runner.js';

async function setupDocs() {
  try {
    await runPullVersions();
    await runGenerateVersions();
    await runGenerateSidebar();
    await runGenerateIndex();

    logWithColor('Setup completed successfully.', 'green');
  } catch (error) {
    logWithColor(`Error during setup: ${error.message}`, 'red');
  }
}

setupDocs();
