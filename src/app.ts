import fastify, { FastifyInstance } from "fastify";
import autoload from "@fastify/autoload";
import path from "path";
import staticPlugin from "@fastify/static";

const app: FastifyInstance = fastify({
  logger: true,
});

// 注册文档路由
interface StaticPluginConfig {
  root: string;
  prefix: string;
}

app.register<StaticPluginConfig>(staticPlugin, {
  root: path.join(__dirname, "../docs"),
  prefix: "/",
});

// 注册api路由
app.register(autoload, {
  dir: path.join(__dirname, "apis"),
  options: { prefix: "/api" },
  dirNameRoutePrefix: true,
  routeParams: true,
});

// 开发模式下打印全部路由
if (process.env.NODE_ENV === "development") {
  app.ready(() => {
    console.log(app.printRoutes());
  });
}

// 启动实例
const init = async () => {
  try {
    await app.listen({ port: 1028, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

init();
