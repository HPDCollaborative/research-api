import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { logWithColor } from './logger.js';
import siteConfig from '../../.vitepress/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '../../', 'src');
const outputDir = path.join(__dirname, '../../', '.vitepress/theme/data');

async function createSidebar(dir, cleanUrls) {
  const sidebar = {};
  const dirs = fs.readdirSync(dir, { withFileTypes: true });

  for (const dirent of dirs) {
    if (dirent.isDirectory() && dirent.name !== 'public' && !dirent.name.startsWith('.')) {
      const navFile = path.join(dir, dirent.name, 'nav.json');

      if (fs.existsSync(navFile)) {
        const navContent = fs.readFileSync(navFile, 'utf-8');
        let navData = JSON.parse(navContent);

        if (!Array.isArray(navData)) {
          navData = [navData];
        }

        navData.forEach((section) => {
          if (Array.isArray(section.items)) {
            section.items.forEach((item) => {
              item.link = `/${dirent.name}/${item.link}${cleanUrls ? '' : '.html'}`;
            });
          }
        });

        sidebar[`/${dirent.name}/`] = navData;
      }
    }
  }

  return sidebar;
}

async function generateSidebar() {
  try {
    const cleanUrls = siteConfig.cleanUrls || false;
    const sidebar = await createSidebar(srcDir, cleanUrls);
    const sidebarString = JSON.stringify(sidebar, null, 2);
    const outputPath = path.join(outputDir, 'sidebar.js');
    fs.writeFileSync(outputPath, `export const sidebar = ${sidebarString};\n`);
    logWithColor('Sidebar generated successfully.', 'green');
  } catch (error) {
    logWithColor(`Error generating sidebar: ${error.message}`, 'red');
  }
}

export { generateSidebar };
