// @ts-nocheck
import { runPullVersions, runGenerateVersions, runGenerateSidebar, runGenerateIndex } from './scripts/runner.js';

const task = process.argv[2]; // Get the task name from command-line arguments

switch (task) {
  case 'pull':
    await runPullVersions();
    break;
  case 'versions':
    await runGenerateVersions();
    break;
  case 'sidebar':
    await runGenerateSidebar();
    break;
  case 'search':
    await runGenerateIndex();
    break;
  default:
    console.error(`Unknown task: ${task}`);
}
