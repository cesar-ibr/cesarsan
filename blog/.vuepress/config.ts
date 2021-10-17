import type { ViteBundlerOptions } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import type { DefaultThemeOptions } from '@vuepress/theme-default';
import { sidebarLinks } from './nav-links';

export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  lang: 'en-US',
  title: 'Cesar Sanchez | Dev Blog',
  description: 'Articles and stories about Web Programming, Open Source, Culture and Technology',
  themeConfig: {
    sidebar: sidebarLinks,
  },
  base: '/blog/',
  dest: `${process.cwd()}/dist/blog`,
  alias: {
    '@assets': `${process.cwd()}/assets`,
  },
});
