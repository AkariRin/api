import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import axios, { AxiosError, AxiosResponse } from "axios";

interface IQuerystring {
  qq: string;
  size?: 40 | 100 | 140 | 640;
  type?: "jpg" | "png";
}

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/",
    {
      schema: {
        querystring: {
          type: "object",
          required: ["qq"],
          properties: {
            qq: { type: "string", pattern: "^[1-9]\\d{4,10}$" },
            size: { type: "integer", enum: [40, 100, 140, 640] },
            type: { type: "string", enum: ["jpg", "png"] },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: IQuerystring }>,
      reply: FastifyReply,
    ) => {
      const { qq, size = 640, type = "png" } = request.query;

      try {
        const response: AxiosResponse<ArrayBuffer> = await axios.get(
          `https://q.qlogo.cn/headimg_dl?dst_uin=${qq}&spec=${size}&img_type=${type}`,
          {
            responseType: "arraybuffer",
            headers: { Referer: "https://qzone.qq.com/" },
            params: { format: type },
          },
        );

        reply
          .header("Content-Type", type === "jpg" ? "image/jpeg" : "image/png")
          .header("Cache-Control", "public, max-age=86400")
          .send(Buffer.from(response.data));
      } catch (err) {
        const error = err as AxiosError;

        if (error.response?.status === 404) {
          reply.code(404).send({ error: "Avatar not found" });
        } else {
          reply.code(500).send({
            error: "Failed to fetch avatar",
            data: error.message,
          });
        }
      }
    },
  );
}
