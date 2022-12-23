// vitejs
import type { UserConfig, ConfigEnv } from 'vite'
import { loadEnv, defineConfig } from 'vite'
import { wrapperEnv } from './build/utils'

// plugins
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueI18n from '@intlify/vite-plugin-vue-i18n'
import { visualizer } from 'rollup-plugin-visualizer'
import legacy from '@vitejs/plugin-legacy'
import { createProxy } from './build/proxy'
import { configCompressPlugin } from './build/compress'
import { configImageminPlugin } from './build/imagemin'
import { configPwaConfig } from './build/pwa'
import { viteMockServe } from 'vite-plugin-mock'

import { resolve } from 'path'
import pkg from './package.json'
import dayjs from 'dayjs'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// 设置应用信息
const { dependencies, devDependencies, name, version } = pkg
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  const env = loadEnv(mode, root)

  // loadEnv读取的布尔类型是一个字符串。这个函数可以转换为布尔类型
  const viteEnv = wrapperEnv(env)

  const {
    VITE_PORT,
    VITE_PUBLIC_PATH,
    VITE_PROXY,
    VITE_DROP_CONSOLE,
    VITE_HTTPS,
    VITE_USE_MOCK,
    VITE_GLOB_APP_TITLE,
    VITE_APP_CONFIG_FILE_NAME,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE,
    VITE_USE_IMAGEMIN,
    VITE_LEGACY
  } = viteEnv

  const isBuild = command === 'build'
  const lifecycle = process.env.npm_lifecycle_event

  const path = VITE_PUBLIC_PATH.endsWith('/') ? VITE_PUBLIC_PATH : `${VITE_PUBLIC_PATH}/`

  const getAppConfigSrc = () => {
    return `${path || '/'}${VITE_APP_CONFIG_FILE_NAME}?v=${pkg.version}-${new Date().getTime()}`
  }

  const buildPlugins = isBuild
    ? [
        // gzip,brotli压缩输出，生产有效
        configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
        // 图片压缩
        VITE_USE_IMAGEMIN && configImageminPlugin(),
        // pwd应用
        configPwaConfig(viteEnv),
        // 浏览器兼容
        VITE_LEGACY && legacy()
      ]
    : []

  return {
    base: VITE_PUBLIC_PATH,
    root,
    esbuild: {
      pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    server: {
      https: VITE_HTTPS,
      // Listening on all local IPs
      host: true,
      port: VITE_PORT,
      // Load proxy configuration from .env
      proxy: createProxy(VITE_PROXY)
    },
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', 'vue-router', '@vueuse/core', '@vueuse/head'],
        resolvers: [ElementPlusResolver()],
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/ // .vue
        ],
        dts: true
      }),
      Components({
        resolvers: [ElementPlusResolver(), IconsResolver()],
        dts: true
      }),
      vueJsx(),
      Icons({
        autoInstall: true
      }),
      viteMockServe({
        ignore: /^\_/,
        mockPath: 'mock',
        supportTs: true,
        prodEnabled: VITE_USE_MOCK,
        // 相当于在src/main.ts中inject下面的代码，所以注意文件的路径问题
        injectCode: `
          import { setupProdMockServer } from '../mock/_createProductionServer';
          setupProdMockServer();
        `
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [pathResolve('src/assets/svg')],
        // 指定symbolId格式
        symbolId: 'icon-[dir]-[name]'
      }),
      // 国际化
      vueI18n({
        // if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
        // compositionOnly: false,

        // you need to set i18n resource including paths !
        include: pathResolve('src/locales/**')
      }),
      // html定制化
      createHtmlPlugin({
        minify: isBuild,
        inject: {
          // Inject data into ejs template
          data: {
            title: VITE_GLOB_APP_TITLE
          },
          // Embed the generated _app.config.js file, 使用esno编译，npm run build:post
          tags: isBuild
            ? [
                {
                  tag: 'script',
                  attrs: {
                    src: getAppConfigSrc()
                  }
                }
              ]
            : []
        }
      }),
      ...buildPlugins,
      // 打包分析
      lifecycle === 'report' &&
        visualizer({
          filename: './node_modules/.cache/visualizer/stats.html',
          open: true,
          gzipSize: true,
          brotliSize: true
        })
    ],
    json: {
      stringify: true
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    resolve: {
      alias: {
        '@': pathResolve('src'),
        types: pathResolve('types'),
        path: 'path-browserify'
        // dayjs: 'dayjs/esm'
      }
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      include: ['**/*.spec.(ts|tsx)', '**/*.test.(ts|tsx)'],
      exclude: ['dist/**', 'build/**', 'mock/**', 'public', '**/node_modules/**'],
      deps: {
        inline: ['vue', 'vue-router', 'vuex', 'axios', 'element-plus']
      }
    }
  }
})
