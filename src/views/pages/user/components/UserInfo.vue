<template>
  <!-- Description list -->
  <div class="mt-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <dl class="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
      <div v-for="(item, index) in profile.infoList" :key="index" class="sm:col-span-1">
        <dt class="text-sm font-medium text-gray-500">
          {{ item.title }}
        </dt>
        <dd class="mt-1 text-sm text-gray-900">
          {{ item.value }}
        </dd>
      </div>
      <div class="sm:col-span-2">
        <dt class="text-sm font-medium text-gray-500">About</dt>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <dd class="mt-1 max-w-prose text-sm text-gray-900 space-y-5" v-html="profile.about" />
      </div>
    </dl>
  </div>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'UserInfo',
    setup() {
      const profile = {
        about: `
    <p>Tincidunt quam neque in cursus viverra orci, dapibus nec tristique. Nullam ut sit dolor consectetur urna, dui cras nec sed. Cursus risus congue arcu aenean posuere aliquam.</p>
    <p>Et vivamus lorem pulvinar nascetur non. Pulvinar a sed platea rhoncus ac mauris amet. Urna, sem pretium sit pretium urna, senectus vitae. Scelerisque fermentum, cursus felis dui suspendisse velit pharetra. Augue et duis cursus maecenas eget quam lectus. Accumsan vitae nascetur pharetra rhoncus praesent dictum risus suspendisse.</p>
  `,

        infoList: [
          {
            title: '电话',
            value: '1371808222'
          },
          {
            title: '邮箱',
            value: 'ricardocooper@example.com'
          },
          {
            title: '职位',
            value: '高级前端开发人员'
          },
          {
            title: '团队',
            value: '产品开发'
          },
          {
            title: '地点',
            value: '旧金山'
          },
          {
            title: '位置',
            value: '绿洲，4楼'
          },
          {
            title: '薪水',
            value: '$145,000'
          },
          {
            title: '生日',
            value: '1990年6月8日'
          }
        ]
      }
      return { profile }
    }
  })
</script>

<style scoped></style>
