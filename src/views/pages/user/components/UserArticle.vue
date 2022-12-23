<template>
  <div class="p-4">
    <ul role="list" class="space-y-4">
      <li
        v-for="question in questions"
        :key="question.id"
        class="bg-white px-4 py-6 shadow sm:p-6 sm:rounded-lg"
      >
        <article :aria-labelledby="'question-title-' + question.id">
          <h2 :id="'question-title-' + question.id" class="text-base font-medium text-gray-900">
            {{ question.title }}
          </h2>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="mt-2 text-sm text-gray-700 space-y-2" v-html="question.body" />
          <div class="mt-6 flex justify-between space-x-8">
            <div class="flex space-x-6">
              <span class="inline-flex items-center text-sm">
                <button
                  type="button"
                  class="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                >
                  <Flag class="h-5 w-5" aria-hidden="true" />
                  <span class="font-medium text-gray-900">{{ question.likes }}</span>
                  <span class="sr-only">likes</span>
                </button>
              </span>
              <span class="inline-flex items-center text-sm">
                <button
                  type="button"
                  class="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                >
                  <Comment class="h-5 w-5" aria-hidden="true" />

                  <span class="font-medium text-gray-900">{{ question.replies }}</span>
                  <span class="sr-only">replies</span>
                </button>
              </span>
              <span class="inline-flex items-center text-sm">
                <button
                  type="button"
                  class="inline-flex space-x-2 text-gray-400 hover:text-gray-500"
                >
                  <View class="h-5 w-5" aria-hidden="true" />
                  <span class="font-medium text-gray-900">{{ question.views }}</span>
                  <span class="sr-only">views</span>
                </button>
              </span>
            </div>
            <div class="flex text-sm">
              <span class="inline-flex items-center text-sm">
                <!-- <span class="font-medium text-gray-900">Share</span> -->

                <p class="text-sm text-gray-500">
                  <time :datetime="question.datetime">{{ question.date }}</time>
                </p>
              </span>
            </div>
          </div>
        </article>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'UserArticle',
    setup() {
      const questions = [
        {
          id: '81614',
          likes: '29',
          replies: '11',
          views: '2.7k',
          date: '2022-05-11 11:43:00',
          datetime: '2022-05-11 11:43:00',
          href: '#',
          title: 'vue Admin',
          body: `
      <p>基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目.</p>
      <p>丰富的基础组件与业务功能组件，工作效率提升 100%</p>
    `
        },
        {
          id: '81614',
          likes: '29',
          replies: '11',
          views: '2.7k',
          date: '2022-05-11 11:43:00',
          datetime: '2022-05-11 11:43:00',
          href: '#',
          title: 'vue Admin',
          body: `
      <p>基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目.</p>
      <p>丰富的基础组件与业务功能组件，工作效率提升 100%</p>
    `
        },
        {
          id: '81614',
          likes: '29',
          replies: '11',
          views: '2.7k',
          date: '2022-05-11 11:43:00',
          datetime: '2022-05-11 11:43:00',
          href: '#',
          title: 'vue Admin',
          body: `
      <p>基于 Vue3.0+TypeScript+Vite+Element-plus 的管理后台项目.</p>
      <p>丰富的基础组件与业务功能组件，工作效率提升 100%</p>
    `
        }
        // More questions...
      ]
      return { questions }
    }
  })
</script>

<style scoped></style>
