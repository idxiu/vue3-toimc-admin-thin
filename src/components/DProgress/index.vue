<template>
  <el-progress v-bind="$attrs" :percentage="percent"></el-progress>
</template>

<script lang="ts">
  import gsap from 'gsap'

  export default defineComponent({
    props: {
      percentage: {
        type: Number,
        default: 0
      },
      isAnimation: {
        type: Boolean,
        default: false
      },
      time: {
        type: Number,
        default: 3000
      },
      ease: {
        type: String,
        default: 'power1.out'
      }
    },
    setup(props) {
      const percent = ref(0)

      onMounted(() => {
        if (props.isAnimation) {
          // const t = Math.ceil(props.time / props.percentage)
          // const timer = setInterval(() => {
          //   percent.value += 1
          //   if (percent.value >= props.percentage) {
          //     clearInterval(timer)
          //     percent.value = props.percentage
          //   }
          // }, t)
          const obj = { value: percent.value }
          gsap.to(obj, {
            value: props.percentage,
            duration: props.time / 1000,
            ease: props.ease,
            onUpdate: () => {
              percent.value = Math.ceil(obj.value)
            }
          })
        } else {
          percent.value = props.percentage
        }
      })

      return {
        percent
      }
    }
  })
</script>

<style scoped></style>
