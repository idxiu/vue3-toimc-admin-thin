import { mount } from '@vue/test-utils'
import Icon from '../index.vue'

describe('Icon.vue', () => {
  test('collections with type', () => {
    expect(Icon).toBeTruthy()

    const wrapper = mount(Icon, {
      props: {
        collection: 'mdi',
        type: 'access-point',
        size: '28px',
        color: 'blue'
      }
    })

    expect(wrapper.element.getAttribute('style')).toContain('--color: blue')
    expect(wrapper.element.getAttribute('style')).toContain('font-size: 28px')
    expect(wrapper.element.className).toContain('el-icon')
  })

  test('use icon props directly', async () => {
    expect(Icon).toBeTruthy()

    const wrapper = mount(Icon, {
      props: {
        icon: 'bi:arrow-clockwise',
        size: '4em',
        color: 'green'
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
    expect(wrapper.element.getAttribute('style')).toContain('--color: green')
    expect(wrapper.element.getAttribute('style')).toContain('font-size: 4em')
  })
})
