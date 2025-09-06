import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Jurono API Documentation Sidebar Configuration
 * Organized structure for API documentation, guides, and examples.
 */
const sidebars: SidebarsConfig = {
  // Main API documentation sidebar
  apiSidebar: [
    'intro',
    'api-reference',
    {
      type: 'category',
      label: 'API Guides',
      items: [
        'guides/authentication',
        'guides/pagination-filtering',
        'guides/webhooks',
      ],
    },
    {
      type: 'category',
      label: 'Code Examples',
      items: [
        'examples/index',
      ],
    },
  ],
};

export default sidebars;
