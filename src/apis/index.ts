/*
  本文件为 /api 路由下的健康检查接口，同时本文件代码也作为api接口的模板
*/
import { FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/", async () => {
    return { status: "ok", timestamp: +new Date() };
  });
}
