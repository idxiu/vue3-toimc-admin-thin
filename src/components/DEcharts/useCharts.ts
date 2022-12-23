import type { ECharts } from 'echarts'

export function useCharts() {
  const chartRef = ref<ECharts | null>(null)

  function delegate(method: string, ...args: any[]) {
    return chartRef.value?.[method](...args)
  }

  return { chartRef, delegate }
}
