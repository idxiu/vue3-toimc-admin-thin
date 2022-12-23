import TCalendar from '../TCalendar.vue'
import { mount } from '@vue/test-utils'

describe('TCalendar.vue', () => {
  test('TCalendar show tools Props', async () => {
    expect(TCalendar).toBeTruthy()

    const wrapper = mount(TCalendar, {
      props: {
        'show-tool': true
      }
    })

    expect(wrapper.find('.el-calendar__header').element.children.length).toBe(1)

    await wrapper.setProps({ 'show-tool': false })

    expect(wrapper.find('.el-calendar__header.w-full').exists()).toBe(false)
  })

  test('TCalendar Position Props', async () => {
    const wrapper = mount(TCalendar, {
      props: {
        position: 'center'
      }
    })

    // 默认position是center
    expect(wrapper.find('.calendar-wrapper-center').exists()).toBe(true)

    await wrapper.setProps({ position: 'left' })

    expect(wrapper.find('.calendar-wrapper-left').exists()).toBe(true)

    await wrapper.setProps({ position: 'left-between' })

    expect(wrapper.find('.calendar-wrapper-left-between').exists()).toBe(true)

    await wrapper.setProps({ position: 'right-between' })

    expect(wrapper.find('.calendar-wrapper-right-between').exists()).toBe(true)
  })

  test('Calendar showAstro,showGzDay,showDayCn Props', async () => {
    const wrapper = mount(TCalendar, {
      props: {
        showAstro: true,
        showGzDay: true,
        showDayCn: true
      }
    })

    expect(wrapper.find('.show-astro').exists()).toBe(true)
    expect(wrapper.find('.show-day-cn').exists()).toBe(true)
    expect(wrapper.find('.show-gz-day').exists()).toBe(true)

    expect(wrapper.find('.addition .pr-2').exists()).toBe(true)

    expect(wrapper.find('.addition .pr-1').exists()).toBe(true)

    // 取消干支
    await wrapper.setProps({ showGzDay: false })
    expect(wrapper.find('.addition .pr-1').exists()).toBe(false)
    expect(wrapper.find('.show-gz-day').exists()).toBe(false)

    // 取消星座
    await wrapper.setProps({ showAstro: false })
    expect(wrapper.find('.show-astro').exists()).toBe(false)

    // 取消阴历
    await wrapper.setProps({ showDayCn: false })
    expect(wrapper.find('.show-day-cn').exists()).toBe(false)
  })
})
