import { SidebarConfig } from '@vuepress/theme-default';

const PATH_WEB_DEV = '/web-development';
const PATH_ALGO = '/algorithms';

export const sidebarLinks: SidebarConfig = [
  {
    text: 'Home',
    link: '/'
  },
  {
    text: 'Web Development',
    link: PATH_WEB_DEV,
  },
  {
    text: 'JavaScript Algorithms',
    link: PATH_ALGO,
    children: [
      {
        text: 'Breath-First Search',
        link: `${PATH_ALGO}/bfs`,
      }
    ]
  },
];