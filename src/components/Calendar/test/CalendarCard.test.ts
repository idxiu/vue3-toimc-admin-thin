import { mount } from '@vue/test-utils'
import CalendarCard from '../CalendarCard.vue'

describe('CalendarCard.vue', () => {
  test('inline CalendarCard', () => {
    expect(CalendarCard).toBeTruthy()

    const wrapper = mount(CalendarCard, {
      props: {
        layout: 'left',
        width: '200',
        class: 'mb-2 mr-4',
        inline: true,
        shadow: true
      }
    })

    expect(wrapper.classes()).toContain('inline-block')

    expect(wrapper.find('.calendar-left')).toBeTruthy()

    expect(wrapper.find('.x-shadow').isVisible()).toBe(true)
  })

  test('CalendarCard position right', () => {
    expect(CalendarCard).toBeTruthy()

    const wrapper = mount(CalendarCard, {
      props: {
        layout: 'right',
        width: '200'
      }
    })

    expect(wrapper.element.className).not.toContain('inline-block')

    // this is not the proper way
    // expect(wrapper.find('.left-top').isVisible()).toBe(false)
    expect(wrapper.find('.calendar-left').element.getAttribute('style')).toContain('display: none')
  })

  test('CalendarCard set font-size', () => {
    expect(CalendarCard).toBeTruthy()

    const wrapper = mount(CalendarCard, {
      props: {
        'font-size': '30',
        height: '300',
        width: '600'
      }
    })
    expect(wrapper.element.hasChildNodes()).toBe(true)
    expect(wrapper.element.children[0].getAttribute('style')).toContain('font-size: 30px;')
    expect(wrapper.element.children[0].getAttribute('style')).toContain('width: 600px;')
  })
})
