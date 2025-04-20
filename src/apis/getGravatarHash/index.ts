import { FastifyPluginAsync } from 'fastify';
import { createHash } from 'crypto';

interface GravatarQuery {
    email: string;
    size?: number;
    defaultImage?: string;
    forceDefault?: boolean;
    rating?: string;
}
//todo：镜像支持
const api: FastifyPluginAsync = async (fastify, _options) => {
    fastify.get<{ Querystring: GravatarQuery }>('/', {
        schema: {
            querystring: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: {
                        type: 'string',
                        format: 'email',
                        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
                    },
                    size: {
                        type: 'number',
                        minimum: 1,
                        maximum: 2048
                    },
                    defaultImage: { type: 'string' },
                    forceDefault: { type: 'boolean' },
                    rating: {
                        enum: ['g', 'pg', 'r', 'x']
                    }
                },
                errorMessage: {
                    required: {
                        email: 'Missing required email parameter'
                    }
                }
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        url: { type: 'string' }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' }
                    }
                }
            }
        }
    }, async (request, reply) => {
        try {
            const { email, ...options } = request.query;

            // 生成 MD5 哈希
            const hash = createHash('md5')
                .update(email.trim().toLowerCase())
                .digest('hex');

            // 构建查询参数
            const params = new URLSearchParams();
            if (options.size) params.set('s', String(options.size));
            if (options.defaultImage) params.set('d', options.defaultImage);
            if (options.forceDefault) params.set('f', 'y');
            if (options.rating) params.set('r', options.rating);

            // 组合最终 URL
            const url = `https://www.gravatar.com/avatar/${hash}${params.toString() ? `?${params}` : ''}`;

            return reply.send({ url });

        } catch (err) {
            return reply.code(500).send({ error: 'Internal server error' });
        }
    });
};

export default api;