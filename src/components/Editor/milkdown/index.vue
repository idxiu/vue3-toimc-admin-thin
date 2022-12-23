<template>
  <VueEditor :editor="editor" />
</template>

<script lang="ts">
  import { VueEditor, useEditor } from '@milkdown/vue'
  import { Editor, rootCtx, defaultValueCtx, createCmdKey } from '@milkdown/core'
  import { nord } from '@milkdown/theme-nord'
  import { listener, listenerCtx } from '@milkdown/plugin-listener'
  // import { commonmark } from '@milkdown/preset-commonmark'
  import { emoji } from '@milkdown/plugin-emoji'
  import { prism } from '@milkdown/plugin-prism'
  import { clipboard } from '@milkdown/plugin-clipboard'
  import { cursor } from '@milkdown/plugin-cursor'
  import { diagram } from '@milkdown/plugin-diagram'
  import { history } from '@milkdown/plugin-history'
  import { indent } from '@milkdown/plugin-indent'
  import { math } from '@milkdown/plugin-math'
  import { menuPlugin } from '@milkdown/plugin-menu'
  import { slash } from '@milkdown/plugin-slash'
  import { tooltip } from '@milkdown/plugin-tooltip'
  import { upload } from '@milkdown/plugin-upload'
  import { useMilkDownConfig } from './config'
  import { gfm } from '@milkdown/preset-gfm'

  import 'katex/dist/katex.min.css'

  export const SelectParent = createCmdKey('SelectParent')

  type MenuType = 'diagram' | 'tooltip' | 'math' | 'upload' | 'slash' | 'menu'

  export default defineComponent({
    components: { VueEditor },
    props: {
      defaultValue: {
        type: String,
        default: ''
      },
      menu: {
        type: Array as PropType<MenuType[]>,
        default: () => ['diagram', 'tooltip', 'math', 'upload', 'slash', 'menu']
      }
    },
    emits: ['beforeMount', 'mounted', 'updated', 'markdownUpdated', 'blur', 'focus', 'destory'],
    setup(props, { emit }) {
      const { defaultValue } = toRefs(props)

      const { config } = useMilkDownConfig()

      const enableKey = (type: MenuType): boolean => props.menu.includes(type)

      const { editor } = useEditor((root) => {
        const instance = Editor.make()
          .config((ctx) => {
            ctx.set(rootCtx, root)
            ctx.set(defaultValueCtx, defaultValue.value)
            ctx
              .get(listenerCtx)
              .beforeMount((ctx) => {
                // before the editor mounts
                emit('beforeMount', ctx)
              })
              .mounted((ctx) => {
                // after the editor mounts
                emit('mounted', ctx)
              })
              .updated((ctx, doc, prevDoc) => {
                // when editor state updates
                emit('updated', { ctx, doc, prevDoc })
              })
              .markdownUpdated((ctx, markdown, prevMarkdown) => {
                // when markdown updates
                emit('markdownUpdated', { ctx, markdown, prevMarkdown })
              })
              .blur((ctx) => {
                // when editor loses focus
                emit('blur', ctx)
              })
              .focus((ctx) => {
                // when focus editor
                emit('focus', ctx)
              })
              .destroy((ctx) => {
                // when editor is being destroyed
                emit('destory', ctx)
              })
          })
          .use(nord)
          .use(emoji)
          .use(gfm)
          // .use(commonmark)
          .use(prism)
          .use(clipboard)
          .use(cursor)
          .use(history)
          .use(indent)
          .use(listener)

        enableKey('diagram') && instance.use(diagram)
        enableKey('tooltip') && instance.use(tooltip)
        enableKey('math') && instance.use(math)
        enableKey('upload') && instance.use(upload)
        enableKey('slash') && instance.use(slash)
        enableKey('menu') && instance.use(menuPlugin({ config }))
        return instance
      })

      return {
        editor
      }
    }
  })
</script>

<style lang="scss">
  /* fallback */
  // @font-face {
  //   font-family: 'Material Icons Outlined';
  //   font-style: normal;
  //   font-weight: 400;
  //   src: url('https://fonts.gstatic.com/s/materialiconsoutlined/v103/gok-H7zzDkdnRel8-DQ6KAXJ69wP1tGnf4ZGhUcel5euIg.woff2')
  //     format('woff2');
  // }

  // .material-icons-outlined {
  //   display: inline-block;
  //   font-family: 'Material Icons Outlined';
  //   font-size: 24px;
  //   -webkit-font-smoothing: antialiased;
  //   font-style: normal;
  //   font-weight: normal;
  //   line-height: 1;
  //   letter-spacing: normal;
  //   text-transform: none;
  //   word-wrap: normal;
  //   white-space: nowrap;
  //   direction: ltr;
  //   font-feature-settings: 'liga';
  // }

  @media only screen and (min-width: 72rem) {
    .milkdown .editor {
      max-width: 57.375rem;
      padding: 3.125rem !important;
    }
  }

  @media only screen and (min-width: 72rem) {
    .loading {
      padding: 3.125rem;
    }
  }

  .loading {
    padding: 3.125rem 1.25rem;
  }

  .milkdown-menu-wrapper {
    max-width: 72rem !important;
  }

  .milkdown-menu-wrapper .milkdown {
    height: calc(100vh - 19rem);
    overflow: auto;
  }

  ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0;
    margin-inline-end: 0;
    padding-inline-start: 40px;
  }
</style>
