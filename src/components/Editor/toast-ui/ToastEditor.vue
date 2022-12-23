<template>
  <div>
    <div ref="editor"></div>
  </div>
</template>

<script lang="ts">
  import type { ToolbarItem } from './types'
  import Prism from 'prismjs'
  import Editor from '@toast-ui/editor'
  import 'prismjs/themes/prism.css'
  import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
  import '@toast-ui/editor/dist/toastui-editor.css'
  import '@toast-ui/editor/dist/theme/toastui-editor-dark.css'
  import '@toast-ui/editor/dist/i18n/zh-cn'
  import '@toast-ui/editor/dist/i18n/zh-tw'
  import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
  import { defineComponent, onMounted, toRefs, ref } from 'vue'

  interface DataProps {
    getHeight: () => string
    getEditorElements: any
    getHTML: () => string
    getMarkdown: () => string
    hide: () => void
    show: () => void
    isMarkdownMode: () => boolean
    isWysiwygMode: () => boolean
    setHeight: (ref?: string) => void
    reset: () => void
    changeMode: (ref?: string) => void
    setLanguage: (ref?: string) => void
    setMarkdown: (ref?: string) => void
    setHTML: (ref?: string) => void
    insertText: (ref?: string) => void
  }

  const defaultToolbarItems = [
    ['heading', 'bold', 'italic', 'strike'],
    ['hr', 'quote'],
    ['ul', 'ol', 'task', 'indent', 'outdent'],
    ['table', 'image', 'link'],
    ['code', 'codeblock']
    // ['scrollSync']
  ]

  export default defineComponent({
    props: {
      height: {
        type: Number,
        default: 500
      },
      initialValue: {
        type: String,
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      previewHighlight: {
        type: Boolean,
        default: false
      },
      initialEditType: {
        type: String as PropType<'markdown' | 'wysiwyg'>,
        default: 'markdown'
      },
      language: {
        type: String as PropType<'en-US' | 'zh-CN' | 'zh-TW'>,
        default: 'zh-CN'
      },
      toolbarItems: {
        type: Array as PropType<Array<ToolbarItem[]>>,
        default: () => defaultToolbarItems
      },
      theme: {
        type: String as PropType<'dark' | ''>,
        default: ''
      }
    },
    setup(props) {
      const {
        height,
        initialValue,
        placeholder,
        previewHighlight,
        initialEditType,
        language,
        toolbarItems,
        theme
      } = toRefs(props)

      let editorIns: any = {}

      const data: DataProps = reactive({
        getHeight: () => {
          return editorIns.getHeight()
        },
        getEditorElements: () => {
          return editorIns.getEditorElements()
        },
        getHTML: () => {
          return editorIns.getHTML()
        },
        getMarkdown: () => {
          return editorIns.getMarkdown()
        },
        hide: () => {
          return editorIns.hide()
        },
        show: () => {
          return editorIns.show()
        },
        isMarkdownMode: () => {
          return editorIns.isMarkdownMode()
        },
        isWysiwygMode: () => {
          return editorIns.isWysiwygMode()
        },
        setHeight: (h) => {
          return editorIns.setHeight(h)
        },
        reset: () => {
          return editorIns.reset()
        },
        changeMode: (mode: string) => {
          return editorIns.changeMode(mode)
        },
        setLanguage: (lang: string) => {
          return Editor.setLanguage(lang, {})
        },
        setMarkdown: (str: string) => {
          return editorIns.setMarkdown(str)
        },
        setHTML: (str: string) => {
          return editorIns.setHTML(str)
        },
        insertText: (str: string) => {
          return editorIns.insertText(str)
        }
      })

      const editor = ref<HTMLElement>()

      const initEditor = () => {
        if (editor.value) {
          editorIns = new Editor({
            el: editor.value,
            height: height.value + 'px',
            initialValue: initialValue.value,
            placeholder: placeholder.value,
            previewStyle: 'vertical',
            previewHighlight: previewHighlight.value,
            initialEditType: initialEditType.value,
            language: language.value,
            toolbarItems: toolbarItems.value,
            theme: theme.value,
            plugins: [[codeSyntaxHighlight, { highlighter: Prism }]]
          })
        }
      }

      onMounted(() => {
        initEditor()
      })

      // theme,language 没有API设置
      watch(
        () => [theme.value, language.value],
        () => {
          initEditor()
        }
      )

      return {
        editor,
        ...toRefs(data)
      }
    }
  })
</script>

<style lang="scss" scoped>
  :deep(.toastui-editor-contents h1) {
    border-bottom: 1px solid #dbdbdb;
  }

  :deep(.toastui-editor-main .toastui-editor-md-splitter) {
    background-color: #d0d0d0;
  }

  :deep(.ProseMirror) {
    height: 100%;
  }
</style>
