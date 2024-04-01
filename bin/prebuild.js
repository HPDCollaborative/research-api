import { logWithColor } from './scripts/logger.js';
import { runGenerateVersions, runGenerateSidebar, runGenerateIndex } from './scripts/runner.js';

async function prebuild() {
  try {
    await runGenerateVersions();
    await runGenerateSidebar();
    await runGenerateIndex();

    logWithColor('Prebuild completed successfully.', 'green');
  } catch (error) {
    logWithColor(`Error during prebuild: ${error.message}`, 'red');
  }
}

prebuild();
