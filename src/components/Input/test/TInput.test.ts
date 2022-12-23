import { mount } from '@vue/test-utils'
import TInput from '../TInput.vue'

describe('TInput.vue', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })
  test('TInput should work', () => {
    expect(TInput).toBeTruthy()
  })
  test('Input should work', async () => {
    const input = ref('input')
    const handleFocus = vi.fn()
    const handleBlur = vi.fn()
    const handleChange = vi.fn()

    const wrapper = mount(TInput, {
      props: {
        modelValue: input,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onChange: handleChange
      }
    })
    const inputEl = wrapper.find('input')
    const nativeInput = inputEl.element

    expect(inputEl.exists()).toBe(true)
    expect(nativeInput.value).toMatchInlineSnapshot('"input"')

    input.value = 'Hello world'
    await nextTick()
    expect(nativeInput.value).toMatchInlineSnapshot('"Hello world"')

    await inputEl.trigger('focus')
    expect(handleFocus).toHaveBeenCalled()

    await inputEl.trigger('blur')
    expect(handleBlur).toHaveBeenCalled()

    await inputEl.trigger('change')
    expect(handleChange).toHaveBeenCalled()
  })

  test('suffixIcon should work', async () => {
    const wrapper = mount(TInput, {
      props: {
        suffixIcon: 'time',
        suffixIconProps: { color: 'red' }
      }
    })
    const icon = wrapper.find('.el-icon')

    expect(icon.exists()).toBe(true)
    expect(icon.attributes('style')).contains('color: red')
  })
  test('prefixIcon  should work', async () => {
    const wrapper = mount(TInput, {
      props: {
        prefixIcon: 'time',
        prefixIconProps: { size: '10px' }
      }
    })

    const icon = wrapper.find('.el-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.attributes('style')).contains('font-size: 10px')
  })
})
