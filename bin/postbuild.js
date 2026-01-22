// @ts-nocheck
import { logWithColor } from './scripts/logger.js';
import { runGenerateIndex } from './scripts/runner.js';

async function postbuild() {
  try {
    await runGenerateIndex();

    logWithColor('Postbuild completed successfully.', 'green');
  } catch (error) {
    logWithColor(`Error during postbuild: ${error.message}`, 'red');
  }
}

postbuild();

