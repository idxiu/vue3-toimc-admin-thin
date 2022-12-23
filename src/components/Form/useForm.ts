import { error } from '@/utils/log'
import { FormActionType, FormSchema } from './types/types'

export function useForm(schema: FormSchema[]) {
  const formRef = ref<Nullable<FormActionType>>(null)

  // 可以在组件里面的 用法示例：
  // watch(
  //   () => model,
  //   (val) => {
  //     console.log('🚀 ~ file: audio.vue ~ line 82 ~ val', unref(val))
  //   },
  //   { deep: true }
  // )
  const formModel = ref({})

  onBeforeMount(() => {
    if (schema.length > 0) {
      formModel.value = schema.reduce((prev, cur: FormSchema) => {
        prev[cur.prop] = cur.value
        return prev
      }, {})
    }
  })

  async function getForm() {
    const form = unref(formRef)

    if (!form) {
      error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!'
      )
    }
    await nextTick()
    return form as FormActionType
  }

  function update(val: typeof formModel) {
    const keys = Object.keys(val)
    if (!keys.length) {
      return
    }
    Object.keys(val).forEach((key) => {
      formModel.value[key] = val[key]
    })
  }

  return {
    formRef,
    getForm,
    model: formModel,
    update
  }
}
