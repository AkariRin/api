import fastify, { FastifyInstance } from 'fastify'
import path from 'path'
import staticPlugin from '@fastify/static'

const app: FastifyInstance = fastify({
    logger: true
})

// 注册文档路由
app.register(staticPlugin, {
    root: path.join(__dirname, '../docs'),
    prefix: '/',
})

// 注册api路由

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