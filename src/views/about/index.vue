<template>
  <div class="p-4">
    <el-card>
      <template #header>
        <div class="flex justify-between items-center">
          <span class="flex-1">
            <el-link :underline="false" type="primary" :href="GITHUB_URL" target="_blank">{{
              name
            }}</el-link
            >是一个基于Vue3.0、Vite、 Element Plus 2.x
            、TypeScript的管理后台解决方案，目标是为中大型项目开发，提供现成的开箱解决方案及丰富的示例，同时开源版本不会限制任何代码用于商用。
          </span>
        </div>
      </template>
      <descriptions title="项目总览" :items="infoSchema"></descriptions>
      <descriptions title="项目依赖" :items="schema" collapse></descriptions>
      <descriptions title="开发依赖" :items="devSchema"></descriptions>
    </el-card>
  </div>
</template>
<script lang="ts">
  import { GITHUB_URL, SITE_URL, DOC_URL } from '@/settings/siteSetting'
  import { DescItem } from '@/components/Descriptions/types'

  export default defineComponent({
    setup() {
      const { pkg, lastBuildTime } = __APP_INFO__

      const { dependencies, devDependencies, name, version } = pkg

      const schema: DescItem[] = []

      const devSchema: DescItem[] = []

      const infoSchema: DescItem[] = [
        {
          label: '版本',
          field: version
        },
        {
          label: '最后编译时间',
          field: lastBuildTime
        },
        {
          label: '文档地址',
          field: {
            link: DOC_URL,
            text: '点击预览'
          }
        },
        {
          label: '预览地址',
          field: {
            link: SITE_URL,
            text: '点击访问'
          }
        },
        {
          label: 'Github',
          field: {
            link: GITHUB_URL,
            text: '点击访问'
          }
        }
      ]

      Object.keys(dependencies).forEach((key) => {
        schema.push({ field: dependencies[key], label: key })
      })

      Object.keys(devDependencies).forEach((key) => {
        devSchema.push({ field: devDependencies[key], label: key })
      })

      return {
        name,
        GITHUB_URL,
        infoSchema,
        schema,
        devSchema
      }
    }
  })
</script>
