import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Jurono API',
  tagline: 'Developer documentation for the Jurono API',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://jurono.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/api-docs/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'jurono', // Usually your GitHub org/user name.
  projectName: 'api-docs', // Usually your repo name.
  trailingSlash: true,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/jurono/api-docs/edit/main/website/',
        },
        blog: false, // Disable blog functionality
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: 'Jurono API',
      logo: {
        alt: 'Jurono Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'apiSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: '/api-docs/openapi.yaml',
          label: 'OpenAPI Spec',
          position: 'left',
          target: '_blank',
        },
        {
          href: 'https://github.com/jurono/api-docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/docs/intro',
            },
            {
              label: 'API Reference',
              to: '/docs/api-reference',
            },
            {
              label: 'Code Examples',
              to: '/docs/examples/',
            },
          ],
        },
        {
          title: 'API Resources',
          items: [
            {
              label: 'OpenAPI Specification',
              href: '/api-docs/openapi.yaml',
              target: '_blank',
            },
            {
              label: 'Postman Collection',
              href: '/api-docs/postman/Jurono.postman_collection.json',
              target: '_blank',
            },
          ],
        },
        {
          title: 'Support',
          items: [
            {
              label: 'GitHub Issues',
              href: 'https://github.com/jurono/api-docs/issues',
            },
            {
              label: 'API Repository',
              href: 'https://github.com/jurono/api',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jurono. API Documentation.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
