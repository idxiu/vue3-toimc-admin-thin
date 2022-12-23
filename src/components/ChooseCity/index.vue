<template>
  <div ref="target" class="inline-flex">
    <el-popover v-model:visible="visible" placement="bottom" :width="500" :hide-after="0">
      <template #reference>
        <div class="choose-city" :style="{ width: width }">
          <el-autocomplete
            v-model="state"
            placeholder="请选择"
            class="flex items-center"
            :trigger-on-focus="false"
            :debounce="0"
            :hide-loading="true"
            :hide-after="0"
            :highlight-first-item="true"
            :fetch-suggestions="querySearch"
            v-bind="$attrs"
            :popper-class="(visible && 'hidden') || ''"
            @focus="handleFocus"
            @blur="handleBlur"
            @select="handleSelect"
          >
            <template #suffix>
              <icon
                icon="ep:arrow-down"
                :class="['rotate-icon', isFocus && 'active']"
                @click="handleFocus"
              />
            </template>
          </el-autocomplete>
        </div>
      </template>
      <template v-if="$props.autoComplete" #default>
        <el-tabs
          ref="tabs"
          v-model="activeName"
          class="choose-city-tabs"
          width="300px"
          @tab-click="handleClick"
        >
          <el-tab-pane v-for="(gItem, index) in group" :key="index" :label="gItem" :name="index">
            <template v-if="index === 0">
              <city-list :lists="hot" @click="handleSelect"></city-list>
            </template>
            <template v-else>
              <el-row v-for="(letter, lIndex) in gItem.split('')" :key="lIndex">
                <el-col :span="3" class="flex justify-center">{{ letter }}</el-col>
                <el-col :span="21">
                  <city-list :lists="cityByLetter[letter]" @click="handleSelect"></city-list>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-popover>
  </div>
</template>

<script lang="ts">
  import { defineComponent, PropType } from 'vue'
  import allAreas from './data/csvjson.json'
  import { CityCSVData } from './types'
  import papa from 'papaparse'
  // import { useCityData } from './useCityData';

  export default defineComponent({
    props: {
      data: {
        type: Array as PropType<CityCSVData[]>,
        default: allAreas
      },
      value: {
        type: String,
        default: ''
      },
      online: {
        type: Boolean,
        default: false
      },
      url: {
        type: String,
        default:
          'https://github.91chi.fun/https://raw.githubusercontent.com/xiangyuecn/AreaCity-JsSpider-StatsGov/master/src/%E9%87%87%E9%9B%86%E5%88%B0%E7%9A%84%E6%95%B0%E6%8D%AE/ok_data_level3.csv'
      },
      autoComplete: {
        type: Boolean,
        default: true
      },
      hotCitys: {
        type: Array as PropType<string[]>,
        default: () => [
          '北京',
          '上海',
          '广州',
          '成都',
          '重庆',
          '西安',
          '昆明',
          '深圳',
          '杭州',
          '厦门',
          '长沙',
          '海口',
          '武汉',
          '乌鲁木齐',
          '郑州',
          '三亚',
          '贵阳',
          '南京',
          '青岛',
          '哈尔滨'
        ]
      },
      width: {
        type: String,
        default: '130px'
      }
    },
    emits: ['change'],
    setup(props, { emit }) {
      // console.log(allAreas)
      const sourceData = ref<CityCSVData[]>(props.data)
      // 省份数据
      const province = ref<CityCSVData[]>()
      const provinceByLetter = ref({})
      // 城市数据
      const city = ref<CityCSVData[]>()
      const cityByLetter = ref({})
      // 热门数据
      const hot = ref<CityCSVData[]>()
      // 组数据
      const group = ref(['热门'])

      // const { province, city, provincePyObj, cityPyObj } = useCityData(allAreas)
      // console.log('🚀 ~ file: index.vue ~ line 14 ~ setup ~ cityPyObj', cityPyObj)
      // console.log('🚀 ~ file: index.vue ~ line 14 ~ setup ~ provincePyObj', provincePyObj)

      onBeforeMount(() => {
        props.online &&
          fetch(props.url)
            .then((res) => res.text())
            .then((body) => {
              const { data } = papa.parse(body)
              const fetchData = [] as any
              if (data.length) {
                const keys = data[0]
                for (let i = 1; i < data.length; i++) {
                  const item = data[i]
                  const obj = {}
                  for (let j = 0; j < keys.length; j++) {
                    obj[keys[j]] = item[j]
                  }
                  fetchData.push(obj)
                }
              }
              sourceData.value = fetchData
            })
        // 省份数据
        province.value = sourceData.value
          .filter((i) => i.deep === 0)
          .map((i) => ({
            ...i,
            full: i.pinyin.replaceAll(' ', ''),
            short: i.pinyin
              .split(' ')
              .map((i) => i[0])
              .join('')
          }))
        // 城市数据
        city.value = sourceData.value
          .filter((i) => i.deep === 1)
          .map((i) => ({
            ...i,
            full: i.pinyin.replaceAll(' ', ''),
            short: i.pinyin
              .split(' ')
              .map((i) => i[0])
              .join('')
          })) as CityCSVData[]
        // 热门数据
        hot.value = props.hotCitys.map(
          (i) => city.value && city.value.find((o) => o.name === i)
        ) as CityCSVData[]

        // 按照拼音首字母
        let n = 0
        let groupName = ''
        for (let i = 0; i < 26; i++) {
          const letter = String.fromCharCode(65 + i)
          const arr = province.value.filter((i) => i.pinyin_prefix.toUpperCase() === letter)
          const arr1 = city.value.filter((i) => i.pinyin_prefix.toUpperCase() === letter)
          if (arr.length) {
            provinceByLetter.value[letter] = arr
          }
          if (arr1.length) {
            groupName += letter
            n++
            // 分组，并在最后一组元素后结束
            if (n > 4 || i === 25) {
              group.value.push(groupName)
              groupName = ''
              n = 0
            }
            cityByLetter.value[letter] = arr1
          }
        }
      })

      // 是否聚焦
      const isFocus = ref(false)
      // 是否显示城市选择
      const visible = ref(false)
      // 最外层容器
      const target = ref(null)
      // tabs城市选择器区域
      const tabs = ref(null)
      // 输入Input框的数据
      const state = ref(props.value)
      // 当前选中的tab
      const activeName = ref('0')

      watch(state, () => {
        visible.value = false
        if (!state.value) {
          visible.value = true
        }
      })

      const handleFocus = () => {
        visible.value = true
        activeName.value = '0'
        isFocus.value = true
      }

      const handleBlur = () => {
        isFocus.value = false
      }

      // 点击空白处隐藏
      onClickOutside(target, (e) => {
        const elem = e.target as HTMLInputElement
        if (elem && elem.contains(target.value)) {
          visible.value = false
          isFocus.value = false
        }
      })

      const querySearch = (q: string, cb: any) => {
        let result = [] as CityCSVData[]
        // 用户输入拼音，拼音首字母或者全拼进行过滤
        if (/^[a-zA-Z]/.test(q)) {
          result =
            (city.value &&
              city.value.filter((i) => i.full.indexOf(q) > -1 || i.short.indexOf(q) > -1)) ||
            []
        }
        // 用户输入汉字
        if (/^[\u4e00-\u9fa5]/.test(q)) {
          result = (city.value && city.value.filter((i) => i.name.indexOf(q) > -1)) || []
        }
        cb(result.map((o) => ({ value: o.name, ...o })))
      }

      const handleSelect = (val) => {
        // 关闭显示tabs
        visible.value = false
        // 设置state的值
        state.value = val.value
        emit('change', val)
      }

      const handleClick = (e) => {
        const index = e.index
        console.log('🚀 ~ file: index.vue ~ line 144 ~ handleClick ~ e', e, index)
      }

      return {
        isFocus,
        target,
        tabs,
        visible,
        state,
        activeName,
        handleFocus,
        handleBlur,
        handleSelect,
        handleClick,
        querySearch,
        group,
        hot,
        cityByLetter
      }
    }
  })
</script>

<style lang="scss">
  .choose-city {
    position: relative;
    display: inline-flex;

    .el-input__suffix {
      align-items: center;
    }
  }

  .choose-city-tabs {
    .el-tabs__nav {
      display: flex;
      width: 100%;
      justify-content: space-evenly;
    }

    .el-tabs__item {
      min-width: 60px;
      padding: 0;
      text-align: center;
      flex: 1;
    }
  }
</style>
