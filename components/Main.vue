<template>
  <section>
    <Console title="About">
      <p class="text-white text-lg">
        Cesar is an eccentric programmer with seven years of experience programming web applications.
        In the last 4 years he has been focused on applications embedded in browsers
        (Frontend Engineering). He's involved in open-source projects, currently contributing to
        <a href="https://github.com/neomjs/neo" class="text-green font-bold underline">
          Neo.mjs.
        </a>
        He writes articles about web technology, open source and internet culture.
        <!-- He's also a podcaster and the host of ProgramArte, a podcast in Spanish about programming. -->
        He loves traveling with his beautiful wife who's the co-host of a
        <a 
          href="https://open.spotify.com/show/0krf5d65nFqoqMAxIlLXai?si=fDllAuvURwOiN5meCmymRQ&dl_branch=1"
          class="font-bold underline text-purple-600"
        > 
          podcast
        </a>
        where they talk about relationships.
      </p>
    </Console>
    <div class="flex flex-wrap justify-center py-16 space-x-4 items-baseline">
      <a
        href="https://github.com/cesar-ibr"
        class="bg-white rounded-full shadow-md px-4 py-2">
          <img class="inline align-text-bottom" width="16" src="/assets/img/github.png" alt="GitHub">
          GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/cesar-sanchez-ibarra/"
        class="bg-white rounded-full shadow-md px-4 py-2">
          <img class="inline align-text-bottom" width="16" src="/assets/img/linkedin.png" alt="LinkedIn">
          LinkedIn
      </a>
      <a
        href="https://www.youtube.com/channel/UCy6QjjEohm4gzBZ6ItAcujw"
        class="bg-white rounded-full shadow-md px-4 py-2">
          <img class="inline align-text-bottom" width="16" src="/assets/img/youtube.svg" alt="YouTube">
          YouTube
      </a>
    </div>
  </section>
</template>

<script>
import Console from './console.vue'

export default {
  components: {
    Console,
  }
}
</script>
