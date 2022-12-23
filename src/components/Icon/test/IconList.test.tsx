import { mount } from '@vue/test-utils'
import IconList from '../IconList.vue'
import { IconData } from '@/components/Icon/data'
import { IconTypes } from '../types'

describe('IconList.vue', () => {
  test('icon-list', () => {
    const wrapper = mount(() => (
      <IconList items={IconData as IconTypes[]} classes="w-1/8"></IconList>
    ))

    expect(wrapper.element.children.length).toBe(IconData.length)
  })
})
