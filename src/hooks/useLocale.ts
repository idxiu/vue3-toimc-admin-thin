/**
 * Multi-language related operations
 */
import type { LocaleType } from 'types/config'

import { useLocaleStoreWithOut } from '@/store/modules/locale'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { i18n } from '@/locales/setupI18n'

function setI18nLanguage(locale: LocaleType) {
  const localeStore = useLocaleStoreWithOut()

  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    ;(i18n.global.locale as any).value = locale
  }

  // 这里就是用localStorage存储了一下
  localeStore.setLocaleInfo({ locale })
  document.querySelector('html')?.setAttribute('lang', locale)
}

export function useLocale() {
  const localeStore = useLocaleStoreWithOut()
  const getLocale = computed(() => localeStore.getLocale)
  const { locale } = useI18n()

  async function changeLocale(val: LocaleType) {
    locale.value = val

    setI18nLanguage(val)
  }

  return {
    getLocale,
    changeLocale
  }
}
