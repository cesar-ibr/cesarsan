# Six Reasons to Use NuxtJS for Your Next Project

## Overview
You might know about Vue.js, or perhaps you have worked on projects using it because Vue.js is very popular and has been around for a while now. However, NuxtJS is not as old as Vue.js is, so maybe you don't know about the advantages of using it as a framework for Vue.js applications. NuxtJS offers not only a standard and well-thought framework but also features like [Server-Side Rendering](https://nuxtjs.org/docs/2.x/concepts/server-side-rendering), [Static-Site Generation](https://nuxtjs.org/docs/2.x/concepts/static-site-generation) and more. Continue reading and find out why the site for [Assassin's Creed - Community Stories](https://assassinscreed.ubisoft.com/story-creator-mode/en-us/) is using it.

## Leverage Vue.js Ecosystem
As you may know, NuxtJS works on top of Vue.js being this the main advantage of the framework.
Vue.js has proven to be a strong library for front-end development, so it's not a coincidence that at the time of writing this article [the project](https://github.com/nuxt/NuxtJS) has more than **300 contributors**, **37k stars** and **3k forks**.

Nuxt makes it easy for you to include any plugin that Vue.js supports. You can be sure that if it works with Vue.js it will work easily with NuxtJS.
In addition, there are more than [160 official modules](https://modules.nuxtjs.org/) available to use. This is another good indicator for the project because it reflects the usage and trust that the open source community has in Nuxt, something that is not easy to achieve.

![Nuxt official modules](../assets/images/nuxt-official-modules.png)

## Installation Wizard
Another nice advantage that Nuxt has is its easy setup process. If you have experience working with modern JavaScript tools I'm sure you are familiar with the CLI (Command Line Interface) that most JS frameworks have today. Nuxt is no exception. It comes with a complete CLI that makes you remember the [Installation Wizard](https://en.wikipedia.org/wiki/Wizard_(software)) that many Desktop Applications have.

![Create Nuxt App](../assets/images/create-nuxt-app.gif)

When you set up a Nuxt project using the CLI you can choose from many libraries and frameworks to install at once in your project. This saves you a lot of time because you can install the right packages and configure them in a single step. No more manual `npm install` nor creating `.xxxxrc` files for the main dependencies.

Some the UI frameworks you can rapidly set up are:
* [Bootstrap Vue](https://bootstrap-vue.org/)
* [Bulma](https://bulma.io/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Vuetify.js](https://vuetifyjs.com/en/)

You can also choose to install [axios](https://axios.nuxtjs.org/) which has gained traction lately due to its simplicity at handling API requests. Another useful package you can install at this point is [PWA](https://pwa.nuxtjs.org/), an excellent solution for setting up your Progressive Web Application without all the complicated configuration you would have to do manually. 

One important Nuxt feature you can configure with the CLI is the [Rendering Mode](https://nuxtjs.org/docs/2.x/features/rendering-modes). Nuxt supports three types of rendering modes: **Client Side**, this is the normal behavior in Single-Page Applications (SPA) and **Server-Side Rendering**, this is to render your application on request, we're going to talk more about this later.


## File System Routing
If there's something hard to get right in web applications is routing. Nuxt offers a simple and reliable [routing system](https://nuxtjs.org/docs/2.x/features/file-system-routing) inspired by the [file system](https://en.wikipedia.org/wiki/File_system).

Maybe this doesn't sound like a very useful feature but think about the time you will save during development due to its simplicity. Using a routing library like [Vue Router](https://router.vuejs.org/) in a big application with many pages and transitions between states is just not enough. You need to design a good strategy that can scale with your app and with your team. It has to be easy to understand so other developers don't have to place weird code just to make it work (You know you've done it). With the routing system handled by Nuxt you just have to create a Vue file inside the `pages` folder to get a new route as simple as it used to be.

Suppose you have this file tree:
```
pages/
--| users/
-----| _id.vue
-----| index.vue
--| users.vue
```
Nuxt will automatically generate this router configuration:

```javascript
router: {
  routes: [
    {
      path: '/users',
      component: 'pages/users.vue',
      children: [
        {
          path: '',
          component: 'pages/users/index.vue',
          name: 'users'
        },
        {
          path: ':id',
          component: 'pages/users/_id.vue',
          name: 'users-id'
        }
      ]
    }
  ]
}
```

Nuxt also handles more uncommon situations like [Dynamic Nested Routes](https://nuxtjs.org/docs/2.x/features/file-system-routing#dynamic-nested-routes).

## State Management Out Of The Box
Since Nuxt embraces the Vue.js ecosystem it is not strange to have [Vuex Store](https://vuex.vuejs.org/) perfectly integrated in the framework. In case you don't know it, Vuex is a state management pattern + library for Vue.js applications. One of the purposes of Nuxt is to provide a solid framework for big applications therefore it has adopted Vuex as its foundation for state management.

Every `js` module you place inside the `store` folder is treated as a [Store Module](https://vuex.vuejs.org/guide/modules.html) without extra-configuration. This module would then be accessible from any component in the application.

In addition, Nuxt lets you add **plugins** directly in the store:

File `store/index.js`
```javascript
import myPlugin from 'myPlugin'

export const plugins = [myPlugin]

export const state = () => ({
  counter: 0
})

export const mutations = {
  increment(state) {
    state.counter++
  }
}
```
Something worth mentioning about Vuex is that it doesn't have an *initial mutation*. Why would you need this? There are situations where you need an initial state in your store that depends on external data not available client-side. For this scenario, Nuxt provides the [nuxtServerInit Action](https://nuxtjs.org/docs/2.x/directory-structure/store#the-nuxtserverinit-action).

File `store/index.js`
```javascript
actions: {
  nuxtServerInit ({ commit }, { req }) {
    if (req.session.user) {
      commit('user', req.session.user)
    }
  }
}
```

> Think thoroughly before making your Store dependent on asynchronous operations for getting started as this could make your application to take longer to start

## Server-Side Rendering
This along with Static-Site Generation are perhaps the most important features that Nuxt offers. Single-Page Applications don't work particularly well with Search Engines because the majority of Search Engines don't execute JavaScript when they index your site making it hard for users to find the content they need from your web pages. Another common problem found with SPAs is the difficulty to request data securely. There are APIs for which you need to use a key in order to request data from them, with SPAs your key gets exposed to the client making your application vulnerable to [XSS attacks](https://owasp.org/www-community/attacks/xss/). For these situations, Server-Side rendering is a more secure strategy because you can make these requests server-side.

Nuxt makes it really easy to start implementing Server-Side rendering in your Vue application. How does it work?
It works similar to traditional MVC frameworks in other languages. When the client makes a request to your page, Nuxt renders the HTML in the server using its internal Node.js server, before sending the final HTML output, Nuxt triggers all the hooks used to get the data that your components need, then the HTML is sent to the client where the Vue.js hydration kicks in, making it reactive. Read the [documentation](https://nuxtjs.org/docs/2.x/concepts/server-side-rendering) for more details on the Server-Side rendering flow.

## Static-Site Generation
As mentioned before, sometimes you need to have good SEO for your site and SPAs are not good in this as static HTML pages are. Also, in your application could exist views or pages that don't need to handle a state or data when displayed to the client like pages with documentation or blog entries. It wouldn't make sense to have reactive components in this case. [Static-Site Generation](https://nuxtjs.org/docs/2.x/concepts/static-site-generation) is very performant in these situations because Nuxt would generate all your static content at build time.

What is faster than building your page on request? Pre-building your page, so you don't have to do it every time the client makes a request.

What if I need to build my page with content coming from an API or CMS? You can rebuild your page by [pushing your changes](https://nuxtjs.org/docs/2.x/concepts/static-site-generation#updating-your-content) to the main branch where you code is hosted. Hosting Providers like [Vercel](https://vercel.com/) and [Netlify](https://netlify.com/) support this feature.

# Final Observations
I just want to mention something very important that most of the time is missed: [Developer Experience](https://css-tricks.com/what-is-developer-experience-dx/). If you haven't realized it yet, more and more open source projects are investing effort to improve the experience their users have with their product. Those users are us, the developers. When you use NuxtJS you get a good dev experience. For the reason that they have many [resources](https://nuxtjs.org/resources), [examples](https://nuxtjs.org/examples) and even [Video Courses](https://masteringnuxt.com/) available for you. I hope that by now you agree with me that NuxtJS is worth a try if you haven't.


