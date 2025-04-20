import fastify, { FastifyInstance } from 'fastify'
import { readdirSync, statSync } from 'fs'
import { join, resolve } from 'path'
// import staticPlugin from '@fastify/static'

const app: FastifyInstance = fastify({
    logger: true
})

/* TODO
// 加载文档
app.register(staticPlugin, {
    root: path.join(__dirname, '../docs'),
    prefix: '/docs/',
    list: true
})
// 根路径重定向
app.get('/', async (_, reply) => {
    reply.redirect('/docs', 302)
})
*/

// 自动注册api路由
async function registerApis(fastify: FastifyInstance) {
    const apiRoot = resolve(__dirname, 'apis')

    // 遍历api目录下的所有子目录
    readdirSync(apiRoot)
        .filter(file => statSync(join(apiRoot, file)).isDirectory())
        .forEach(dir => {
            const routePath = join(apiRoot, dir, 'index.ts')

            try {
                // 注册路由
                fastify.register(require(routePath).default, { prefix: `/api/${dir}` })
                fastify.log.info(`API:[${dir}]注册成功`)
            } catch (error) {
                fastify.log.error(`API:[${dir}]注册失败:${error}`)
            }
        })
}

// 启动服务器
const start = async () => {
    try {
        await registerApis(app)
        await app.listen({ port: 1028 })
    } catch (err) {
        app.log.error(err)
        process.exit(1)
    }
}

start()