import { mount } from '@vue/test-utils'

import DProgress from '../index.vue'

describe('Progress test case', () => {
  test('percent should work', () => {
    expect(DProgress).toBeTruthy()
  })

  test('percent does work', async () => {
    const wrapper = mount(DProgress, {
      props: {
        percentage: 90
      }
    })

    await nextTick()

    expect(wrapper.find('.el-progress__text').text()).toBe('90%')
    expect(
      wrapper.find('.el-progress-bar__inner').attributes('style')
    ).includes('width: 90%')
  })

  test('animation does work', () => {
    const wrapper = mount(DProgress, {
      props: {
        isAnimation: true,
        time: 3000
      }
    })

    expect(wrapper.find('.el-progress-bar__inner').attributes('style')).toBe(
      'width: 0%; animation-duration: 3s;'
    )
  })
})
