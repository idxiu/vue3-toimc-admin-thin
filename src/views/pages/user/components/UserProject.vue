<template>
  <div class="p-4">
    <ul
      role="list"
      class="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
    >
      <li
        v-for="file in files"
        :key="file.source"
        class="relative border border-gray-300 shadow p-2"
      >
        <div
          class="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden"
        >
          <img
            :src="file.source"
            alt=""
            class="object-cover pointer-events-none group-hover:opacity-75"
          />
          <button type="button" class="absolute inset-0 focus:outline-none">
            <span class="sr-only">View details for {{ file.title }}</span>
          </button>
        </div>
        <p class="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{{
          file.title
        }}</p>
        <p class="block text-sm font-medium text-gray-500 pointer-events-none">{{ file.size }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'UserProject',
    setup() {
      const files = [
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        },
        {
          title: 'vue Admin',
          size: '基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目',
          source:
            'https://camo.githubusercontent.com/f29c9c621cef8d55432290553ee89251cabb538f401112ed74142f7e6058993b/68747470733a2f2f746f696d632d6f6e6c696e652e6f62732e636e2d656173742d332e6d79687561776569636c6f75642e636f6d2f6c6f676f2e706e67'
        }
      ]
      return { files }
    }
  })
</script>

<style scoped></style>
