import type { ViteBundlerOptions } from '@vuepress/bundler-vite';
import { defineUserConfig } from '@vuepress/cli';
import type { DefaultThemeOptions } from '@vuepress/theme-default';
// import vue from '@vitejs/plugin-vue';

export default defineUserConfig<DefaultThemeOptions, ViteBundlerOptions>({
  lang: 'en-US',
  title: 'The Eccentric Programmer',
  description: 'Articles and Stories about Web Programming',
  // when using vuepress-vite package, you can omit this field
  // because vite is the default bundler
  // bundler: '@vuepress/bundler-vite',
  // options for vite bundler
  bundlerConfig: {
  },
  base: '/blog/',
  dest: `${process.cwd()}/dist/blog`
})