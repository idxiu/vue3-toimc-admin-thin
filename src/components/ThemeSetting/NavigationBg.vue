<template>
  <div class="grid grid-cols-4 gap-2">
    <div
      v-for="(item, index) in items"
      :key="item.value"
      :class="['nav-bg-item', { active: activeIndex === index }]"
      @click="() => handleChange(index, item)"
    >
      <template v-if="item.type === 'icon'">
        <icon :icon="item.value" :size="item.size" :color="item.color || '#515A6E'"></icon>
      </template>
      <template v-else>
        <div
          :style="{ backgroundImage: 'url(' + item.value + ')' }"
          class="bg-contain w-full h-full bg-center bg-no-repeat"
        />
      </template>
    </div>
  </div>
</template>

<script>
  import { defineComponent } from 'vue'
  import demo from './assets/background.png'

  export default defineComponent({
    props: {
      lists: {
        type: Array,
        default: () => []
      },
      moreFunc: {
        type: Function,
        default: () => {}
      }
    },
    emits: ['change', 'more'],
    setup(props, { emit }) {
      const activeIndex = ref(0)

      const items = ref([
        {
          type: 'icon',
          value: 'mdi:water-off-outline',
          size: '26px',
          color: '#515A6E'
        },
        {
          type: 'icon',
          value: 'ep:more-filled',
          size: '26px',
          color: '#515A6E',
          click: () => {
            props.moreFunc && props.moreFunc()
            emit('more')
          }
        }
      ])

      watch(
        () => {
          if (props.lists.length > 0) {
            items.value.splice(
              1,
              0,
              ...props.lists.map((o) => ({
                type: 'img',
                value: o
              }))
            )
          } else {
            items.value.splice(1, 0, {
              type: 'img',
              value: demo
            })
          }
        },
        {
          immediate: true,
          deep: true
        }
      )

      const handleChange = (index, item) => {
        if (item.click) {
          item.click()
        } else {
          // 只有点击非more的时候才会触发change
          activeIndex.value = index
          emit('change', item)
        }
      }

      return {
        activeIndex,
        items,
        handleChange
      }
    }
  })
</script>

<style lang="scss" scoped>
  .nav-bg-item {
    @apply cursor-pointer flex overflow-hidden items-center justify-center;

    width: 60px;
    height: 60px;
    margin: 5px;
    background-color: #f7f7f7;
    border-radius: 5px;

    &.active {
      box-shadow: 0 0 2px 2px #1890ff;
    }

    img {
      @apply w-full h-full;
    }
  }
</style>
