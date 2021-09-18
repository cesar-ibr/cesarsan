<template>
  <div class="rounded-lg bg-gray max-w-md m-auto">
      <!-- Console header -->
      <div class="rounded-t-lg p-2 bg-gray-dark">
        <span class="mr-4 space-x-1">
          <svg class="inline fill-current text-red-500" width="12" height="12">
            <circle cx="6" cy="6" r="6" />
          </svg>
          <svg class="inline fill-current text-yellow-500" width="12" height="12">
            <circle cx="6" cy="6" r="6" />
          </svg>
          <svg class="inline fill-current text-green" width="12" height="12">
            <circle cx="6" cy="6" r="6" />
          </svg>
        </span>
        <p class="inline font-bold">
          <span class="text-blue">&#126;&#47;{{ title }}</span>
          <span class="text-green">&#62;&#32;</span>
        </p>
      </div>
      <!-- Console Content -->
      <div class="p-4">
        <slot />
      </div>
    </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
}
</script>
