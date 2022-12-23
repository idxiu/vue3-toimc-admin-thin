<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane v-for="(item, index) in lists" :key="index" :label="item.title" :name="item.title">
      <el-scrollbar max-height="300px">
        <ul v-if="item.content">
          <li
            v-for="(msg, msgIndex) in item.content"
            :key="msgIndex"
            class="py-2 cursor-pointer hover:bg-blue-100"
            @click="handleClickItem(msg, msgIndex)"
          >
            <el-row justify="center" align="middle">
              <el-col :span="4" class="flex justify-center">
                <el-avatar v-if="msg.avatar" size="small" :src="msg.avatar"></el-avatar>
              </el-col>
              <el-col :span="20" class="px-3">
                <el-row class="mb-2" align="middle">
                  <div class="text-base overflow-ellipsis">{{ msg.title }}</div>
                  <el-tag
                    v-if="msg.tag"
                    effect="dark"
                    size="small"
                    :type="msg.tagType"
                    class="ml-2"
                    >{{ msg.tag }}</el-tag
                  >
                </el-row>
                <div v-if="msg.desc" class="text-sm text-gray-400 mb-2 line-clamp-2">{{
                  msg.desc
                }}</div>
                <div class="text-sm text-gray-400">{{ msg.time }}</div>
              </el-col>
            </el-row>
          </li>
        </ul>
      </el-scrollbar>
    </el-tab-pane>
    <div class="flex justify-around actions cursor-pointer">
      <div
        v-for="(action, i) in actions"
        :key="i"
        class="action-item flex items-center flex-1 justify-center hover:bg-blue-100"
        @click="handleClickAction(action, i)"
      >
        <icon v-if="action.icon" :type="action.icon" class="mr-1" size="18px" />
        <span>{{ action.title }}</span>
      </div>
    </div>
  </el-tabs>
</template>

<script lang="ts">
  import { PropType } from 'vue'
  import type { MessageListOptions, ActionOptions, MessageListItem } from './types'

  export default defineComponent({
    name: 'MessageList',
    props: {
      lists: {
        type: Array as PropType<MessageListOptions[]>,
        default: () => []
      },
      actions: {
        type: Array as PropType<ActionOptions[]>,
        default: () => []
      }
    },
    emits: ['change', 'clickItem', 'clickAction'],
    setup(_props, { emit }) {
      const activeName = ref('通知')

      const handleClick = (tab, event: Event) => {
        emit('change', { tab, event })
      }

      const handleClickItem = (item: MessageListItem, index: number) => {
        // activeName.value = tab
        emit('clickItem', { item, index })
      }

      const handleClickAction = (item: ActionOptions, index: number) => {
        // activeName.value = tab
        emit('clickAction', { item, index })
      }

      return {
        activeName,
        handleClick,
        handleClickItem,
        handleClickAction
      }
    }
  })
</script>

<style lang="scss" scoped>
  @import '@/assets/style/variables.scss';

  .actions {
    border-top: 1px solid $border-color-gray;

    .action-item {
      height: 45px;
      line-height: 45px;
      border-right: 1px solid $border-color-gray;

      &:last-child {
        border-right: none;
      }
    }
  }
</style>
