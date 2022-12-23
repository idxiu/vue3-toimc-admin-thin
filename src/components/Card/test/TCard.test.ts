import { mount } from '@vue/test-utils'
import TCard from '../TCard.vue'

describe('TCard.vue', () => {
  test('TCard should work', async () => {
    expect(TCard).toBeTruthy()
  })

  test('TCard props should work', async () => {
    const wrapper = mount(TCard, {
      props: {
        header: 'Card header'
      }
    })

    expect(wrapper.find('.el-card__header').element.children.length).toBe(1)
    expect(wrapper.find('.el-card__header').text()).toBe('Card header')

    await wrapper.setProps({ bodyStyle: { color: 'red' } })
    expect(wrapper.find('.el-card__body').attributes('style')).toBe('color: red;')

    await wrapper.setProps({
      headerClass: 'header-class',
      bodyClass: 'body-class',
      footerClass: 'footer-class'
    })

    expect(wrapper.find('.header-class').exists()).toBe(true)
    expect(wrapper.find('.body-class').exists()).toBe(true)
    expect(wrapper.find('.footer-class').exists()).toBe(false)

    await wrapper.setProps({ collapse: true })
    expect(wrapper.find('.rotate-icon.active').exists()).toBe(true)

    await wrapper.setProps({ shadow: 'always' })
    expect(wrapper.find('.is-always-shadow').exists()).toBe(true)

    await wrapper.setProps({ size: 'large' })
    expect(wrapper.classes('card-large')).toBe(true)

    await wrapper.setProps({ tips: { content: '这里是tips', placement: 'top' } })
    expect(wrapper.find('.el-tooltip__trigger').exists()).toBe(true)

    await wrapper.setProps({ layout: 'shadow' })
    expect(wrapper.find('.footer').exists()).toBe(false)

    await wrapper.setProps({ tipsIcon: 'ant-design:caret-up-filled' })
    expect(wrapper.find('.header svg').exists()).toBe(true)
  })

  test('TCard slots should work ', async () => {
    const wrapper = mount(TCard, {
      slots: {
        default: () => 'Card body',
        header: () => 'Card header',
        footer: () => 'Card footer'
      }
    })

    expect(wrapper.find('.el-card__header').text()).toBe('Card header')
    expect(wrapper.find('.el-card__body').text()).contains('Card body')
    expect(wrapper.find('.footer').exists()).toBe(true)
    expect(wrapper.find('.footer').text()).toBe('Card footer')
  })
})
