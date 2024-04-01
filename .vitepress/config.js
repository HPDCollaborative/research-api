import 'dotenv/config';
import { defineConfigWithTheme } from 'vitepress';
import anchor from 'markdown-it-anchor';
import MarkdownItContainer from 'markdown-it-container';
import { versions } from './theme/data/versions.js';
import { sidebar } from './theme/data/sidebar.js';

const defaultVersion =
  versions.length > 0 ? versions.reduce((max, v) => (v.text > max ? v.text : max), versions[0].text) : '1.0';

import viteConfig from '../vite.config.js';

export default defineConfigWithTheme({
  title: 'HPDC Research API Documentation',
  description: 'Documentation detailing the repository research api output.',
  base: '/',
  cleanUrls: true,
  srcDir: './src',
  outDir: './dist',
  markdown: {
    image: {
      lazyLoading: true,
    },
    theme: {
      light: 'dracula',
      dark: 'dracula',
    },
    anchor: {
      permalink: undefined,
    },
    config(md) {
      md.use(anchor, {
        permalink: anchor.permalink.ariaHidden({
          placement: 'before',
        }),
        permalinkSymbol: '#',
        level: [2, 3],
      });
      md.use(MarkdownItContainer, 'abstract', {
        validate: function (params) {
          return !!params.trim().match(/^abstract\s+(.*)$/);
        },
        render: function (tokens, idx) {
          var m = tokens[idx].info.trim().match(/^abstract\s+(.*)$/);

          if (tokens[idx].nesting === 1) {
            let title = m && m[1] ? md.utils.escapeHtml(m[1]) : '';
            title = title.toUpperCase();

            return '<div class="custom-block abstract">\n' + `  <p class="custom-block-title">${title}</p>\n`;
          } else {
            // closing tag
            return '</div>\n';
          }
        },
      });
    },
  },

  ignoreDeadLinks: true,
  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo.svg',
    },
    nav: false,
    sidebar: sidebar,
    versions: versions,
    defaults: {
      version: defaultVersion,
      page: '',
    },
    copyright: 'Health Product Declaration Collaborative, Inc',
    githubUrl: false,
    gitlabUrl: false,
    twitterUrl: false,
    search: {
      provider: 'local', // local or meilisearch only
      options: {
        placeholder: 'Search ...',
        host: process.env.SEARCH_HOST,
        apiKey: process.env.SEARCH_KEY,
        indexName: process.env.INDEX_NAME,
      },
    },
  },
  vite: {
    ...viteConfig,
  },
  head: [
    ['link', { rel: 'preconnect', href: 'https://fonts.bunny.net' }],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.bunny.net/css?family=poppins:300,400,500,600,700,800,900&display=swap',
      },
    ],
    [
      'link',
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '16x16',
        type: 'image/png',
        href: '/favicon-16x16.png',
      },
    ],
    [
      'link',
      {
        rel: 'icon',
        sizes: '32x32',
        type: 'image/png',
        href: '/favicon-32x32.png',
      },
    ],
    [
      'link',
      {
        rel: 'mask-icon',
        href: '/safari-pinned-tab.svg',
        color: '#5bbad5',
      },
    ],
    [
      'link',
      {
        rel: 'manifest',
        href: '/site.webmanifest',
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-TileColor',
        content: '#00b5e0',
      },
    ],
    [
      'meta',
      {
        name: 'msapplication-TileImage',
        content: '/mstile-150x150.png',
      },
    ],
    [
      'meta',
      {
        name: 'theme-color',
        content: '#ffffff',
      },
    ],
  ],
});
