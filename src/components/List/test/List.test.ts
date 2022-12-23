import { mount } from '@vue/test-utils'

import { MessageListOptions, ActionOptions } from '../types'

import MessageList from '../MessageList.vue'

describe('List test case', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('Lists does work', async () => {
    const data = ref<MessageListOptions[]>([
      {
        title: '1',
        content: [
          {
            avatar: 'avatar',
            title: 'title',
            desc: 'desc',
            time: 'time',
            tag: 'tag',
            tagType: 'success'
          }
        ]
      }
    ])

    const handleChange = vi.fn()

    const handleClickItem = vi.fn()

    const wrapper = mount(MessageList, {
      props: {
        lists: data.value,
        onChange: handleChange,
        onClickItem: handleClickItem
      }
    })

    await nextTick()

    expect(wrapper.findAll('.el-tabs__item').length).toBe(data.value.length)

    const tabEL = wrapper.findAll('.el-tabs__item')

    expect(tabEL[0].text()).toBe('1')

    await tabEL[0].trigger('click')
    expect(handleChange).toHaveBeenCalled()

    const itemEL = wrapper.findAll('li')
    await itemEL[0].trigger('click')
    expect(handleClickItem).toHaveBeenCalled()
  })

  test('actions does work', async () => {
    const as = ref<ActionOptions[]>([
      {
        title: 'title',
        icon: 'ArrowLeft'
      }
    ])

    const handleClickAction = vi.fn()

    const wrapper = mount(MessageList, {
      props: {
        actions: as.value,
        onClickAction: handleClickAction
      }
    })

    expect(wrapper.find('.actions').element.children.length).toBe(
      as.value.length
    )

    const actionEl = wrapper.findAll('.action-item')
    await actionEl[0].trigger('click')
    expect(handleClickAction).toHaveBeenCalled()
  })
})
