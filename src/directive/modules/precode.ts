import type { Directive } from 'vue'
import TuiEditor from '@toast-ui/editor'

const mounted = (el) => {
  const content = el.outerHTML
    .match(/<pre([\s\S])*?>([\s\S]*?)<\/pre>/)[2]
    .split('\n')
    .map((item) => item.trim())
    .join('\n')
  TuiEditor.factory({
    el: el,
    viewer: true,
    initialValue: content
  })
  el.outerHTML = el.innerHTML
}

const precode: Directive = {
  mounted
}

export default precode
