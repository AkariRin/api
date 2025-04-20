import { viteBundler } from '@vuepress/bundler-vite'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { hopeTheme } from "vuepress-theme-hope";
import { defineUserConfig } from 'vuepress'

export default defineUserConfig({
    bundler: viteBundler(),
    theme: hopeTheme({
        // 此处放置主题配置
    }),
    lang: 'zh-CN',
    title: 'Akari APIs',
    description: 'Akari APIs文档站',
    plugins: [
        googleAnalyticsPlugin({
            id: 'G-FSF5887ELG',
        }),
    ],
})