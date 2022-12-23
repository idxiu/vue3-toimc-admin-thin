import { mount } from '@vue/test-utils'

import AvatarList from '../index.vue'

describe('AvatarList test case', () => {

  afterEach(() => {
    vi.resetAllMocks()
  })

  const wrapper = mount(AvatarList, {
    props: {
      images: [
        'https://github.com/toimc-team/vue3-toimc-admin/blob/main/public/resource/img/logo.png',
        'https://github.com/toimc-team/vue3-toimc-admin/blob/main/public/resource/img/logo.png'
      ]
    }
  })
  test('create', () => {
    expect(AvatarList).toBeTruthy()
  })

  test('Set image does work', () => {
    // wrapper.setProps({})

    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.findAll('img').length).toBe(2)
  })

  test('Set size does work', async () => {
    wrapper.setProps({ size: 40 })
    await nextTick()
    expect(wrapper.find('.el-avatar').attributes('style')).includes(
      '--el-avatar-size: 40px;'
    )
  })

  test('Set direction does work', async () => {
    wrapper.setProps({ direction: 'vertical' })
    await nextTick()
    expect(wrapper.find('ul').classes()).includes('flex-col')

    wrapper.setProps({ direction: 'horizontal' })
    await nextTick()
    expect(wrapper.find('ul').classes()).includes('flex-row')
  })

  test('Set borderWidth and borderColor does work', async () => {
    wrapper.setProps({ borderWidth: '5px', borderColor: '#000' })
    await nextTick()
    expect(wrapper.find('li').attributes('style')).includes(
      'border-color: #000; border-width: 5px;'
    )
  })

  test('Hide more', async () => {
    expect(wrapper.find('.more').exists()).toBe(true)
    wrapper.setProps({ showMore: false })
    await nextTick()
    expect(wrapper.find('.more').exists()).toBe(false)
  })

  test('Click event does work', async () => {
    const handleClick = vi.fn()
    const w = mount(AvatarList, {
      props: {
        images: [
          'https://github.com/toimc-team/vue3-toimc-admin/blob/main/public/resource/img/logo.png',
          'https://github.com/toimc-team/vue3-toimc-admin/blob/main/public/resource/img/logo.png'
        ],
        onClick: handleClick
      }
    })
    await w.find('.el-avatar').trigger('click')
    expect(handleClick).toHaveBeenCalled()
  })
})
