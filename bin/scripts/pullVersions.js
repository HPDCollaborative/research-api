// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { logWithColor } from './logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DOCS_VERSIONS = JSON.parse(process.env.DOC_VERSIONS);
const REPO_URL = process.env.REPO_URL || null;

const cloneOrUpdate = (version) => {
  return new Promise((resolve, reject) => {
    const versionDir = path.join(__dirname, '../../src', version);

    if (fs.existsSync(versionDir)) {
      logWithColor(`Removing and recloning ${version}...`, 'yellow');
      exec(`rm -rf "${versionDir}"`, (rmError) => {
        if (rmError) {
          logWithColor(`Error removing ${version} directory: ${rmError}`, 'red');
          reject(rmError);
          return;
        }

        exec(
          `git clone --single-branch --branch ${version} ${REPO_URL} "${versionDir}" && rm -rf "${versionDir}/.github"`,
          (cloneError, stdout, stderr) => {
            if (cloneError) {
              logWithColor(`Error cloning ${version}: ${cloneError}`, 'red');
              reject(cloneError);
              return;
            }
            logWithColor(`${version} cloned successfully.`, 'green');
            resolve(stdout);
          }
        );
      });
    } else {
      logWithColor(`Cloning ${version}...`, 'yellow');
      exec(
        `git clone --single-branch --branch ${version} ${REPO_URL} "${versionDir}" && rm -rf "${versionDir}/.github"`,
        (error, stdout, stderr) => {
          if (error) {
            logWithColor(`Error cloning ${version}: ${error}`, 'red');
            reject(error);
            return;
          }
          logWithColor(`${version} cloned successfully.`, 'green');
          resolve(stdout);
        }
      );
    }
  });
};

const pullVersions = async () => {
  if (REPO_URL) {
    try {
      await Promise.all(DOCS_VERSIONS.map(cloneOrUpdate));
    } catch (error) {
      logWithColor('Error during pulling versions', 'red');
      throw error;
    }
  } else {
    logWithColor('No repository URL is set in your env file.', 'red');
    throw new Error('Repository URL is not set');
  }
};

export { pullVersions };
