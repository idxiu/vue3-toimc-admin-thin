<template>
  <div class="video-player-wrap">
    <video
      v-for="(item, idx) in list"
      :key="getKey(item) || idx"
      ref="videoRefs"
      class="video-js video-player"
    >
    </video>
    <slot name="list">
      <ul class="video-list mt-5">
        <li
          v-for="(item, idx) in list"
          :key="idx"
          class="video-item"
          :class="{ active: idx === state.index }"
          @click="changeItem(idx)"
          >{{ item.title }}</li
        >
      </ul>
    </slot>
  </div>
</template>

<script lang="ts">
  import './player-icon.css'
  import videojs from 'video.js'
  import 'video.js/dist/video-js.min.css'

  const VideoJsButton = videojs.getComponent('Button')
  const VideoJsMenuButton = videojs.getComponent('MenuButton')
  const VideoJsMenu = videojs.getComponent('Menu')
  const VideoJsMenuItem = videojs.getComponent('MenuItem')

  const ACTIVE_CLS = 'is-live'

  type VideoSourcesItem = {
    src: string
    type: string
  }

  interface VideoPlayerItem {
    title: string
    sources?: VideoSourcesItem[]
    src?: string
    poster?: string
  }

  const loopList = [
    {
      label: '顺序播放',
      value: 0
    },
    {
      label: '列表循环',
      value: 1
    },
    {
      label: '单个循环',
      value: 2
    },
    {
      label: '随机播放',
      value: 3
    }
  ]

  export default {
    name: 'VideoPlayer',
    props: {
      list: {
        type: Array as PropType<VideoPlayerItem[]>,
        default: () => []
      },
      index: { type: Number, default: 0 },
      title: { type: String, default: '' },
      autoplay: { type: Boolean, default: false },
      volume: { type: Number, default: 1 },
      muted: { type: Boolean, default: false },
      loop: { type: Number, default: 0 },
      rate: { type: Number, default: 1 },
      playbackRates: { type: Array, default: () => [0.5, 1, 1.5, 2] }
    },
    emits: ['update:index', 'update:volume', 'update:muted', 'update:loop', 'update:rate'],
    setup(_props, { emit, expose }) {
      const state = reactive({
        index: _props.index,
        volume: _props.volume,
        muted: _props.muted,
        loop: _props.loop,
        rate: _props.rate
      })

      const videoRefs = ref<HTMLVideoElement[]>([])
      const player = ref<videojs.Player | null>(null)
      const playerMap = new Map<HTMLVideoElement, any>()

      const initPlayer = () => {
        const elArr = videoRefs.value
        const el = elArr[state.index]
        if (!el) return
        const currentItem = _props.list[state.index]
        if (player.value) {
          player.value.pause()
          player.value.el()?.classList.remove(ACTIVE_CLS)
        }
        const temp = playerMap.get(el)
        if (temp) {
          player.value = temp
          player.value.volume(state.volume)
          player.value.muted(state.muted)
          player.value.playbackRate(state.rate)
          player.value.loop(state.loop === 2)
          player.value.play()
          player.value.el()?.classList.add(ACTIVE_CLS)
          return
        }
        // 初始化， 绑定事件， 新增按钮
        player.value = videojs(
          el,
          {
            // restoreEl: true,
            fill: true,
            controls: true,
            autoplay: _props.autoplay || true,
            loop: state.loop === 2,
            muted: state.muted,
            playbackRates: _props.playbackRates,
            preload: 'auto',
            sources: currentItem.sources || [{ src: currentItem.src }],
            poster: currentItem.poster
          },
          () => {
            const playerInterface = player.value
            // init options
            playerInterface.volume(state.volume)
            playerInterface.muted(state.muted)
            playerInterface.playbackRate(state.rate)
            playerInterface.loop(state.loop === 2)
            playerInterface.play()
          }
        )
        playerMap.set(el, player.value)
        player.value.el()?.classList.add(ACTIVE_CLS)
        player.value.on('end', function () {
          next()
        })
        player.value.on('volumechange', () => {
          state.volume = player.value.volume()
          emit('update:volume', state.volume)
        })
        player.value.on('ratechange', () => {
          console.log('ratechange')
          state.rate = player.value.playbackRate()
          emit('update:volume', state.rate)
        })
        const prevBtn = new VideoJsButton(player.value, {
          className: 'video-js-play-button-prev',
          controlText: '上一首',
          clickHandler() {
            prev()
          }
        })
        const nextBtn = new VideoJsButton(player.value, {
          className: 'video-js-play-button-next',
          controlText: '下一首',
          clickHandler() {
            next()
          }
        })
        const loopBtn = new VideoJsMenuButton(player.value, {
          className: 'loopBtn video-js-play-button-loop player-loop-' + (state.loop + 1),
          controlText: '循环',
          clickHandler() {
            console.log('loop', this)
          }
        })
        const loopMenu = new VideoJsMenu(player.value, {})
        loopList.forEach((item) => {
          const menuItem = new VideoJsMenuItem(player.value, {
            className: 'video-js-play-button-loop-item',
            label: item.label
          })
          menuItem.on('click', function () {
            console.log('loop', item.value)
            state.loop = item.value
            loopBtn.el().className = loopBtn
              .el()
              .className.replace(/player-loop-\d/, 'player-loop-' + (state.loop + 1))
          })
          loopMenu.addItem(menuItem)
        })

        loopBtn.addChild(loopMenu)
        player.value.controlBar.addChild(prevBtn, {}, 0)
        player.value.controlBar.addChild(nextBtn, {}, 2)
        player.value.controlBar.addChild(loopBtn, {}, 20)
      }

      onMounted(() => {
        initPlayer()
      })
      onBeforeUnmount(() => {
        videojs.getAllPlayers().forEach((player) => {
          player.dispose()
        })
        playerMap.clear()
      })

      const getNextIndex = () => {
        const list = _props.list
        let nextIndex: number
        if (state.loop === 3) {
          nextIndex = Math.floor(Math.random() * list.length)
        } else if (state.loop === 2) {
          nextIndex = state.index
        } else {
          nextIndex = state.index + 1
          // 根据是否列表循环决定回到第一个还是结束
          if (nextIndex >= list.length) {
            nextIndex = state.loop === 1 ? 0 : -1
          }
        }
        return nextIndex
      }
      const getPrevIndex = () => {
        const list = _props.list
        let prevIndex: number
        if (state.loop === 3) {
          prevIndex = Math.floor(Math.random() * list.length)
        } else if (state.loop === 2) {
          prevIndex = state.index
        } else {
          prevIndex = state.index - 1
          // 根据是否列表循环决定回到是否结束
          if (prevIndex < 0) {
            prevIndex = state.loop === 1 ? list.length - 1 : -1
          }
        }
        return prevIndex
      }

      // 方法
      const play = () => {
        if (player.value) {
          player.value.play()
        }
      }
      const stop = () => {
        if (player.value) {
          player.value.pause()
        }
      }
      const pause = () => {
        if (player.value) {
          player.value.pause()
        }
      }
      const prev = () => {
        const prevIndex = getPrevIndex()
        if (prevIndex !== -1) {
          state.index = prevIndex
          player.value.pause()
          emit('update:index', prevIndex)
          initPlayer()
          player.value.play()
        }
      }
      const next = () => {
        const nextIndex = getNextIndex()
        if (nextIndex !== -1) {
          state.index = nextIndex
          player.value.pause()
          emit('update:index', nextIndex)
          initPlayer()
          player.value.play()
        }
      }

      expose({ play, stop, pause, prev, next })

      return {
        videoRefs,
        state,
        play,
        stop,
        pause,
        prev,
        next,
        getKey: (item) => {
          if (item.src) {
            return item.src
          } else if (item.sources) {
            return item.sources[0].src
          }
        },
        changeItem: (index) => {
          state.index = index
          initPlayer()
        }
      }
    }
  }
</script>

<style lang="scss">
  .video-js {
    display: none;

    &.is-live {
      display: block;
    }

    .video-js-play-button-prev,
    .video-js-play-button-next,
    .video-js-play-button-loop {
      .vjs-icon-placeholder::before {
        font-family: player !important;
        font-size: 16px;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-style: normal;
      }
    }

    .video-js-play-button-prev .vjs-icon-placeholder::before {
      content: '\e691';
    }

    .video-js-play-button-next .vjs-icon-placeholder::before {
      content: '\e692';
    }

    .video-js-play-button-loop {
      &::before {
        display: none;
      }

      &.player-loop-1 .vjs-icon-placeholder::before {
        content: '\e6a1';
      }

      &.player-loop-2 .vjs-icon-placeholder::before {
        content: '\e6a3';
      }

      &.player-loop-3 .vjs-icon-placeholder::before {
        content: '\e6a2';
      }

      &.player-loop-4 .vjs-icon-placeholder::before {
        content: '\e6a0';
      }
    }
  }

  .video {
    &-item {
      line-height: 1.5;
      cursor: pointer;

      &::before {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 10px;
        background: #ddd;
        border-radius: 50%;
        content: ' ';
      }

      &.active {
        color: var(--el-color-primary);

        &::before {
          background: var(--el-color-primary);
        }
      }
    }
  }
</style>
