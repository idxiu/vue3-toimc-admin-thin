<template>
  <el-breadcrumb class="breadcrumb" separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbData" :key="item.path">
        <span v-if="index === breadcrumbData.length - 1" class="no-redirect">{{
          $t(item.meta.title)
        }}</span>
        <span v-else class="redirect" @click="onLinkClick(item)">{{ $t(item.meta.title) }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script lang="ts">
  import { ref, watch } from 'vue'
  import { useRoute, useRouter, RouteLocationMatched } from 'vue-router'

  export default defineComponent({
    setup() {
      const breadcrumbData = ref<any>([])
      const route = useRoute()
      const router = useRouter()

      const getBreadcrumbData = () => {
        breadcrumbData.value = route.matched.filter((item) => item.meta && item.meta.title)
      }

      watch(
        route,
        () => {
          getBreadcrumbData()
        },
        {
          immediate: true
        }
      )

      const onLinkClick = (item: RouteLocationMatched) => {
        const { redirect, path } = item
        if (redirect) {
          router.push(redirect.toString())
          return
        }
        router.push(path)
      }
      return {
        onLinkClick,
        breadcrumbData
      }
    }
  })
</script>

<style lang="scss" scoped>
  .breadcrumb {
    display: inline-block;
    margin-left: 8px;
    font-size: 14px;
    line-height: 50px;

    .redirect {
      font-weight: 600;
      color: #666;
      cursor: pointer;

      &:hover {
        color: #304156;
      }
    }

    :deep(.no-redirect) {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
