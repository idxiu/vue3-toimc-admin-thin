import { defineStore } from 'pinia'
import defaultSettings from '@/config'
import _ from 'lodash-es'
import {
  generateMainColors,
  generateTextColors,
  generateBorderColors,
  generateFillColors,
  generateBgColors,
  generateMaskColors,
  generateBoxShadowColors
} from '@/utils/theme'
import { TransitionNameEnum } from '@/enums/menuEnum'
import { THEME_SETTINGS_KEY } from '@/enums/cacheEnum'

const localThemeSettings = localStorage.getItem('toimc-admin-theme')
const mergeThemeSettings = _.merge(
  {},
  defaultSettings,
  localThemeSettings !== null ? JSON.parse(localThemeSettings) : {}
)

const { layout, fixHeader, menuWidth, darkMode, primaryColor, tabPage } = mergeThemeSettings

export type ThemeSettingsType = {
  layout: string
  fixHeader: boolean
  darkMode: boolean
  menuWidth: string
  primaryColor: string
  tabPage: boolean
  backgroundImg: string
  transitionName: string
}

export const useSettingsStore = defineStore('settings', {
  state: (): UseKeyAble<ThemeSettingsType> =>
    ({
      layout: layout || 'siderbar',
      fixHeader: fixHeader || true,
      darkMode: darkMode || false,
      menuWidth: menuWidth || '266px',
      primaryColor: primaryColor || '#409eff',
      tabPage: tabPage || true,
      transitionName: TransitionNameEnum.Fade,
      backgroundImg: ''
    } as ThemeSettingsType),
  getters: {
    getLayout: (state) => state.layout
  },
  actions: {
    getThemeColors() {
      const defineColor = {
        primary: { light: this.primaryColor, dark: this.primaryColor }
      }
      return _.merge(
        {},
        generateMainColors(defineColor),
        generateTextColors(),
        generateBorderColors(),
        generateFillColors(),
        generateBgColors(),
        generateMaskColors(),
        generateBoxShadowColors()
      )
    },
    resetSetting() {
      this.$reset()
    }
  },
  persist: {
    key: THEME_SETTINGS_KEY
  }
})
