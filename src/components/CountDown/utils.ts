import dayjs from 'dayjs'
import { ConfigType } from 'dayjs'

export const dayFormat = (date: ConfigType) => dayjs(date).format('YYYY-MM-DD')

export const calculateDay = (date: ConfigType) => dayjs(date).diff(dayjs(), 'day')

export const calculateMountDay = (date: number) => {
  if (date <= 0 || date > 31) return '无效'
  const today = dayjs().date()
  const mouth = dayjs().month()
  const year = dayjs().year()
  if (date >= today) {
    return date - today
  } else {
    const next = dayjs()
      .set('month', mouth + 1)
      .set('year', year)
      .set('date', date)

    return calculateDay(next)
  }
}

export const countdown = (data: ConfigType, endText) => {
  const hour = dayjs(data).hour()
  const minute = dayjs(data).minute()
  const second = dayjs(data).second()
  const hourNow = dayjs().hour()
  if (hourNow < hour) {
    const finalDatetime = dayjs().set('hour', hour).set('minute', minute).set('second', second)
    const diff = finalDatetime.valueOf() - dayjs().valueOf()
    return dayjs(diff - 8 * 60 * 60 * 1000).format('HH:mm:ss')
  } else {
    return endText || '到点啦'
  }
}
