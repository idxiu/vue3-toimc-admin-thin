<template>
  <div>
    <el-row class="pt-3 pb-1" align="middle">
      <el-col :span="8" class="overflow-ellipsis">
        <span class="text-lg font-bold">{{ title }}</span>
      </el-col>
      <el-col :span="16" class="flex justify-end items-center">
        <slot v-if="!extra" name="extra"></slot>
        <template v-else>
          <span class="pr-2">{{ extra }}</span>
        </template>
        <icon
          v-if="collapse"
          icon="ep:arrow-down"
          :class="['rotate-icon', isCollapse && 'active']"
          @click="toggle"
        />
      </el-col>
    </el-row>
    <collapse-container :collapse="isCollapse">
      <el-descriptions
        :direction="direction"
        :size="size"
        :border="border"
        :column="column"
        class="toimc-custom-descriptions"
      >
        <!-- <template v-if="!extra" #extra>
      <slot name="extra"></slot>
      <icon type="ArrowUp" @click="toggle" />
        </template>-->
        <el-descriptions-item v-for="(item, index) in items" :key="index" v-bind="item.attrs">
          <template #label>
            <icon
              v-if="item.icon"
              :type="item.icon"
              :size="item.iconSize + ''"
              :color="item.iconColor"
            />
            {{ item.label }}
          </template>
          <slot name="field">
            <el-tag v-if="item.tag" v-bind="item.tag">{{ item.field }}</el-tag>
            <el-link
              v-else-if="typeof item.field !== 'string'"
              target="_target"
              :underline="false"
              :href="item.field.link || '#'"
              :type="item.field.type || 'primary'"
              >{{ item.field.text }}</el-link
            >
            <template v-else>{{ item.field }}</template>
          </slot>
        </el-descriptions-item>
      </el-descriptions>
    </collapse-container>
  </div>
</template>

<script lang="ts">
  import { DescItem } from './types'

  export default defineComponent({
    props: {
      direction: {
        type: String as PropType<'vertical' | 'horizontal'>,
        default: 'horizontal'
      },
      size: {
        type: String as PropType<'large' | 'default' | 'small'>,
        default: 'default'
      },
      title: {
        type: String,
        default: ''
      },
      extra: {
        type: String,
        default: ''
      },
      border: {
        type: Boolean,
        default: true
      },
      collapse: {
        type: Boolean,
        default: true
      },
      items: {
        type: Array as PropType<DescItem[]>,
        default: () => []
      },
      column: {
        type: Number,
        default: 3
      }
    },
    setup() {
      const [isCollapse, toggle] = useToggle(false)

      return {
        isCollapse,
        toggle
      }
    }
  })
</script>

<style lang="scss">
  .toimc-custom-descriptions {
    padding: 6px 0;

    .el-descriptions__header {
      margin-bottom: 8px;
    }
  }
</style>
