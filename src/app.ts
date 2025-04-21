import fastify, { FastifyInstance } from 'fastify'
import { readdirSync, statSync } from 'fs'
import path from 'path'
import staticPlugin from '@fastify/static'

const app: FastifyInstance = fastify({
    logger: true
})

// 注册文档路由
app.register(staticPlugin, {
    root: path.join(__dirname, '../docs/.vuepress/dist'),
    prefix: '/',
})

// 自动注册api路由
const apiRoot = path.resolve(__dirname, 'apis')
readdirSync(apiRoot)
    .filter(file => statSync(path.join(apiRoot, file)).isDirectory())
    .forEach(dir => {
        try {
            app.register(require(path.join(apiRoot, dir, 'index.ts')).default, { prefix: `/api/${dir}` })
            app.log.info(`API[${dir}] registered`)
        } catch (error) {
            app.log.error(`API[${dir}] register failed:${error}`)
        }
    })

// 启动实例
const start = async () => {
    try {
        await app.listen({ port: 1028 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()