<template>
  <div class="p-4">
    <t-card>
      <!-- Profile header -->
      <div>
        <img class="h-32 w-full object-cover lg:h-48" :src="profile.coverImageUrl" alt="" />
      </div>
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div class="flex">
            <img
              class="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
              :src="header"
              alt=""
            />
          </div>
          <div
            class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
          >
            <div class="sm:hidden 2xl:block mt-6 min-w-0 flex-1">
              <h1 class="text-2xl font-bold text-gray-900 truncate">
                {{ profile.name }}
              </h1>
            </div>
          </div>
        </div>
        <div class="hidden sm:block 2xl:hidden mt-6 min-w-0 flex-1">
          <h1 class="text-2xl font-bold text-gray-900 truncate">
            {{ profile.name }}
          </h1>
        </div>
      </div>
      <!-- Tabs -->
      <el-tabs v-model="activeName" class="mt-6 sm:mt-2 2xl:mt-5" @tab-click="handleClick">
        <el-tab-pane label="信息" name="info">
          <user-info></user-info>
        </el-tab-pane>
        <el-tab-pane label="文章" name="article">
          <user-article></user-article>
        </el-tab-pane>
        <el-tab-pane label="项目" name="project">
          <user-project></user-project>
        </el-tab-pane>
      </el-tabs>
    </t-card>
  </div>
</template>

<script lang="ts">
  import type { TabsPaneContext } from 'element-plus'
  import UserInfo from '@/views/pages/user/components/UserInfo.vue'
  import UserArticle from '@/views/pages/user/components/UserArticle.vue'
  import UserProject from '@/views/pages/user/components/UserProject.vue'

  import header from '@/assets/images/brian.jpg'

  import { Random } from 'mockjs'

  export default defineComponent({
    components: {
      UserInfo,
      UserArticle,
      UserProject
    },
    setup() {
      const profile = {
        name: '张三',
        coverImageUrl:
          'https://toimc-online.obs.cn-east-3.myhuaweicloud.com/vue-toimc-admin/shotcuts/pic' +
          Random.integer(1, 100) +
          '.jpg'
      }
      const activeName = ref('info')

      const handleClick = (tab: TabsPaneContext, event: Event) => {
        console.log(tab, event)
      }
      return {
        profile,
        header,
        activeName,
        handleClick
      }
    }
  })
</script>

<style scoped></style>
