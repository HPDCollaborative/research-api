// @ts-nocheck
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { logWithColor } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../../', 'src');

async function generateVersions() {
  try {
    const files = await fs.readdir(srcDir);
    const versionDirs = (
      await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(srcDir, file);
          if (await isVersionDirectory(filePath, file)) {
            return file;
          }
          return null;
        })
      )
    ).filter(Boolean);

    const baseVersions = versionDirs
      .sort()
      .reverse()
      .map((version) => ({
        text: version,
        link: `/${version}/`,
      }));

    const versionsContent = `export const versions = ${JSON.stringify(baseVersions, null, 2)};\n`;
    await fs.writeFile(path.join(__dirname, '../../', '.vitepress/theme/data', 'versions.js'), versionsContent);
    logWithColor('Versions file generated successfully.', 'green');
  } catch (error) {
    logWithColor(`Error generating versions: ${error.message}`, 'red');
  }
}

async function isVersionDirectory(filePath, file) {
  try {
    const stats = await fs.stat(filePath);
    return stats.isDirectory() && /^\d+\.\d+$/.test(file);
  } catch {
    return false;
  }
}

export { generateVersions };
