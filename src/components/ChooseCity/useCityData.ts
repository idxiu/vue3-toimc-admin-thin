import type { AreaItem } from '../ChooseArea/types'
import type { ProvincePyItem, CityPyItem } from './types'

import pinyin from 'pinyin'

// todo 问题，可能有多音字
// 使用这个脚本抓取的数据应该是最新的
// https://github.com/xiangyuecn/AreaCity-JsSpider-StatsGov/blob/master/src/2_1_%E6%8A%93%E5%8F%96%E6%8B%BC%E9%9F%B3.js

// 比较可靠的数据源：https://gitee.com/xiangyuecn/AreaCity-JsSpider-StatsGov/raw/master/src/%E9%87%87%E9%9B%86%E5%88%B0%E7%9A%84%E6%95%B0%E6%8D%AE/ok_data_level3.csv
export function useCityData(data: AreaItem[]) {
  // 获取所有省份数据
  const province = [] as ProvincePyItem[]
  // 获取所有城市数据
  const city = [] as CityPyItem[]
  data.forEach((item) => {
    // 转化拼音
    const full = pinyin(item.name, {
      style: pinyin.STYLE_NORMAL
    }).reduce((acc, cur) => (acc += cur), '')
    const short = pinyin(item.name, {
      style: pinyin.STYLE_FIRST_LETTER
    }).reduce((acc, cur) => (acc += cur), '')
    province.push({
      name: item.name,
      code: item.code,
      capital: short[0].toUpperCase(),
      full,
      short
    })

    if (item.children && item.children.length > 0) {
      item.children.forEach((i) => {
        if (i.name !== '市辖区' && i.name !== '县') {
          // 转化拼音
          const fullCity = pinyin(i.name, { style: pinyin.STYLE_NORMAL }).reduce(
            (acc, cur) => (acc += cur),
            ''
          )
          const shortCity = pinyin(i.name, { style: pinyin.STYLE_FIRST_LETTER }).reduce(
            (acc, cur) => (acc += cur),
            ''
          )
          city.push({
            name: i.name,
            code: i.code,
            capital: shortCity[0].toUpperCase(),
            full: fullCity,
            short: shortCity,
            province: {
              name: item.name,
              code: item.code,
              capital: short[0].toUpperCase(),
              full,
              short
            }
          })
        } else {
          city.push({
            name: item.name,
            code: i.code,
            capital: short[0].toUpperCase(),
            full: full,
            short: short,
            province: {
              name: item.name,
              code: item.code,
              capital: short[0].toUpperCase(),
              full,
              short
            }
          })
        }
      })
    }
  })
  // 按照拼音首字母获取省份数据
  const provincePyObj = {} as { [key: string]: ProvincePyItem[] }
  const cityPyObj = {} as { [key: string]: CityPyItem[] }

  // 按照拼音首字母获取城市数据
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i)
    const arr = province.filter((i) => i.capital === letter)
    const arr1 = city.filter((i) => i.capital === letter)
    if (arr.length) {
      provincePyObj[letter] = arr
    }
    if (arr1.length) {
      cityPyObj[letter] = arr1
    }
  }

  return {
    province,
    city,
    provincePyObj,
    cityPyObj
  }
}
