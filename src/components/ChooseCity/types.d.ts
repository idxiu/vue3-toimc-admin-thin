export interface ProvincePyItem {
  name: string
  code: string
  // 拼音首字母
  capital?: string
  // 拼音全拼
  full?: string
  // 拼音词语首字母缩写
  short?: string
}

export interface CityPyItem {
  name: string
  code: string
  // 拼音首字母
  capital?: string
  full?: string
  // 拼音词语首字母缩写
  short?: string
  province?: ProvincePyItem
}

export interface CityCSVData {
  deep?: number
  ext_id?: number
  ext_name?: string
  full: string
  id: number
  name: string
  pid: number
  pinyin: string
  pinyin_prefix: string
  short: string
}
