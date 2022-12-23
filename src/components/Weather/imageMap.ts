import { IDayOryNight } from './types'
export function weatherFormatter(name: string) {
  if (name.includes('风')) {
    return '风'
  }
  if (name.includes('霾') || name.includes('雾')) {
    return '雾'
  }
  if (name.includes('雨')) {
    return '雨'
  }
  if (name.includes('雪')) {
    return '雪'
  }
  return name
}

export const weatherMap: Record<string, any> = {
  晴: 'sunny',
  少云: 'sunny',
  晴间多云: 'cloudy',
  多云: 'cloudy',
  阴: 'yin',
  风: 'wind',
  雾: 'foggy',
  雨: 'rain',
  雪: 'snow'
}

function getImage(name: string) {
  return new URL(`./assets/images/${name}.jpg`, import.meta.url).href
}

export function getWeatherImageURL(name: string, dayOrNight: IDayOryNight = '') {
  const _name = weatherFormatter(name) || '未知'
  const word = weatherMap[_name]
  let wordNow = '_d'
  if (dayOrNight !== '') {
    wordNow = dayOrNight === 'night' ? '_n' : '_d'
  } else {
    const now = new Date()
    wordNow = now.getHours() < 6 || now.getHours() > 18 ? '_n' : '_d'
  }
  return getImage(word + wordNow)
}
