import { FastifyPluginAsync } from 'fastify'

const api: FastifyPluginAsync = async (fastify, options) => {
    fastify.get('/', async (request, reply) => {
        //todo
        return {}
    })
}

export default api