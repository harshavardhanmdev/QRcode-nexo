import Fastify from "fastify";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";
import { config, isProd } from "./config.js";
import "./db/migrate.js"; // migrates on boot
import { registerAuthPlugin } from "./plugins/auth.js";
import { registerAuthRoutes } from "./routes/auth.js";
import { registerGoogleRoutes } from "./routes/google.js";
import { registerDesignRoutes } from "./routes/designs.js";
import { registerDynamicRoutes } from "./routes/dynamic.js";
import { registerMiscRoutes } from "./routes/misc.js";

const app = Fastify({
  logger: isProd
    ? { level: "info" }
    : { level: "info", transport: undefined },
  trustProxy: config.TRUST_PROXY,
  bodyLimit: 256 * 1024,
});

await app.register(cookie);
await app.register(helmet, {
  // the API serves JSON + one tiny 404 page; CSP belongs to the Next app
  contentSecurityPolicy: false,
});
await app.register(rateLimit, {
  global: true,
  max: 300,
  timeWindow: "1 minute",
});

registerAuthPlugin(app);
registerAuthRoutes(app);
registerGoogleRoutes(app);
registerDesignRoutes(app);
registerDynamicRoutes(app);
registerMiscRoutes(app);

app.setNotFoundHandler((req, reply) => {
  reply.code(404).send({ error: "not found" });
});

try {
  // localhost only — the public entrance is the Next proxy / Cloudflare
  await app.listen({ port: config.API_PORT, host: "127.0.0.1" });
  app.log.info(`qrdock api listening on 127.0.0.1:${config.API_PORT}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
