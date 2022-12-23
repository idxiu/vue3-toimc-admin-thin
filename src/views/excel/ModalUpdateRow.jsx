import { ref, computed, nextTick } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
export default {
  emits: ['changeTableByRow'],
  setup (props, ctx) {
    let dialogVisible = ref(false)
    let currentIndex = ref(0)
    const tagColumns = ref([])
    let formDataCurrent = ref({})
    const hide = () => {
      dialogVisible.value = false
      ctx.emit('changeTableByRow', formDataCurrent.value, currentIndex.value)
    }
    const show = async (columns, data, index) => {
      dialogVisible.value = true
      tagColumns.value = columns
      currentIndex.value = index
      await nextTick()
      formDataCurrent.value = data
    }
    const formPlaceholder = computed(() => {
      return tagColumns.value.map(item => '请正确填写Excel表' + item + '列')
    })
    const formLabel = computed(() => {
      return tagColumns.value.map(item => 'Excel表' + item + '列')
    })
    ctx.expose({
      show
    })
    return {
      dialogVisible,
      tagColumns,
      formDataCurrent,
      formLabel,
      formPlaceholder,
      hide,
      show
    }
  },
  render () {
    return (
      <ElDialog
        v-model={this.dialogVisible}
        title="修改"
        width="500px"
      >
        <div style={{height:'400px',overflowY: 'scroll'}}>
          <ElForm ref="form" model={this.formDataCurrent} label-width="200px" label-position="left">
            {this.tagColumns.map((item, index) => {
              return (
                <ElFormItem label={this.formLabel[index]} prop={item} key={item}>
                  <ElInput v-model={this.formDataCurrent[item]} placeholder={this.formPlaceholder[index]}></ElInput>
                </ElFormItem>
              )
            })}
          </ElForm>
        </div>
        <ElButton onClick={this.hide}>确定修改</ElButton>
      </ElDialog>
    )
  }
}
