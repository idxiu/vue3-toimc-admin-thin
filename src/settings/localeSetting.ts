// import type { DropMenu } from '../components/Dropdown'
import type { LocaleSetting, LocaleType } from 'types/config'
import { DropMenuItem } from '../components/DropDown/types'

export const LOCALE: { [key: string]: LocaleType } = {
  ZH_CN: 'zh-CN',
  EN_US: 'en'
}

export const localeSetting: LocaleSetting = {
  // Locale
  locale: LOCALE.ZH_CN,
  // Default locale
  fallback: LOCALE.ZH_CN,
  // available Locales
  availableLocales: [LOCALE.ZH_CN, LOCALE.EN_US]
}

// locale list
export const localeList: DropMenuItem[] = [
  {
    text: '简体中文',
    value: LOCALE.ZH_CN
  },
  {
    text: 'English',
    value: LOCALE.EN_US
  }
]
