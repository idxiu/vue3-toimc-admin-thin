<template>
  <div class="wrapper" :style="{ backgroundImage: 'url(' + weatherImage + ')', ...finalStyle }">
    <div class="weather-box">
      <div class="weather-icon-wrapper">
        <img :src="weatherIcon" alt="weather icon" />
      </div>
      <div
        class="weather-text-wrapper"
        :style="{ justifyContent: textPosition === 'center' ? 'center' : 'space-around' }"
      >
        <div>
          <div class="temperature">{{ temperature }}°</div>
          <div v-show="wind" class="wind">{{ windDirection }} {{ windPower }}级</div>
        </div>

        <div class="city">{{ cityName }} | {{ weatherText }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import defaultIcon from './assets/weather-static-icon/not-available.svg'
  import { getWeatherIconURL } from './iconMap'
  import { getWeatherImageURL } from './imageMap'
  import { IDayOryNight } from './types'
  export default defineComponent({
    name: 'WeatherSimple',
    props: {
      animation: {
        type: Boolean,
        default: false
      },
      dayOrNight: {
        type: String as PropType<IDayOryNight>,
        default: ''
      },
      componentStyle: {
        type: Object,
        default: () => {}
      },
      textPosition: {
        type: String as PropType<'center' | 'around'>,
        default: 'around'
      },
      wind: {
        type: Boolean,
        default: true
      }
    },
    setup(props) {
      const cityName = ref('')
      const adcode = ref('')

      const weatherIcon = ref(defaultIcon)
      const temperature = ref('24')
      const weatherText = ref('未知')
      const weatherImage = ref('')
      const windDirection = ref('未知')
      const windPower = ref('0')
      const finalStyle = ref({})

      const getFinalStyle = () => {
        const style: any = {}
        if (props.componentStyle?.width) {
          style.width = props.componentStyle.width + 'px'
          style.height = props.componentStyle.height + 'px'
          style.fontSize = props.componentStyle.fontSize + 'px'
          style.borderRadius = props.componentStyle.borderRadius + 'px'
        }
        return style
      }

      const getLocation = async () => {
        const url = 'https://restapi.amap.com/v3/ip?key=4057b14b748b340111a0e2eb67f6391c'
        const res = await fetch(url)
        const result = await res.json()
        adcode.value = result.adcode
        cityName.value = result.province + result.city
      }

      const getWeather = async () => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?key=4057b14b748b340111a0e2eb67f6391c&city=${adcode.value}&extensions=base`
        const res = await fetch(url)
        const { status, lives } = await res.json()
        if (status === '1') {
          const { weather, temperature: _temperature, winddirection, windpower } = lives[0]
          weatherIcon.value = getWeatherIconURL(weather, props.animation)
          temperature.value = _temperature
          weatherText.value = weather
          windDirection.value = winddirection
          windPower.value = windpower
          weatherImage.value = getWeatherImageURL(weather, '')
        }
      }

      onMounted(async () => {
        await getLocation()
        await getWeather()
        finalStyle.value = getFinalStyle()
      })

      watch(
        () => props.animation,
        (value) => {
          weatherIcon.value = getWeatherIconURL(weatherText.value, value)
        }
      )

      watch(
        () => props.dayOrNight,
        (value) => {
          console.log(value)
          weatherImage.value = getWeatherImageURL(weatherText.value, value as any)
        }
      )

      watch(
        () => props.componentStyle,
        () => {
          finalStyle.value = getFinalStyle()
        },
        { deep: true }
      )

      return {
        cityName,
        weatherIcon,
        weatherText,
        weatherImage,
        temperature,
        finalStyle,
        windDirection,
        windPower
      }
    }
  })
</script>
<style lang="scss" scoped>
  .wrapper {
    display: inline-flex;
    width: 300px;
    height: 200px;
    font-size: 18px;
    color: #fefefe;
    background-size: cover;
    border-radius: 3px;
  }

  .weather-box {
    display: flex;
    justify-content: space-around;
    flex: 1;

    .weather-icon-wrapper {
      display: flex;
      align-items: center;

      img {
        width: 4.4em;
        height: 4.4em;
      }
    }

    .weather-text-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.4em;
      justify-content: space-around;

      .temperature {
        font-size: 2.8em;
      }

      .city {
        padding-right: 0.8em;
        font-size: 0.8em;
      }
    }
  }
</style>
