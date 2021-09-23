import type { ViteBundlerOptions } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import type { DefaultThemeOptions } from '@vuepress/theme-default';
import { sidebarLinks } from './nav-links';

export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  lang: 'en-US',
  title: 'The Eccentric Programmer',
  description: 'Articles and Stories about Web Programming',
  themeConfig: {
    sidebar: sidebarLinks,
  },
  base: '/blog/',
  dest: `${process.cwd()}/dist/blog`,
  alias: {
    '@assets': `${process.cwd()}/assets`,
  },
});
