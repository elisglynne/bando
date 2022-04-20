/**
 * Main entry point to Bando.
 */
import { Application, Router } from "./deps.ts";

// Sets up Oak application router.
const router = new Router();

/**
 * Generic handler for root path of the application.
 */
router.get("/", ({response}) => {
  response.headers.set("Content-Type", "application/json");
  response.body = {  message: "Hello World again!" };
});

/**
 * Returns the mocked response found in the mocks directory. Can be nested or can
 * be a single file with the same name as the request path. For example, if the
 * mock-er wants to mock the request to /foo/bar, it should be in the mocks
 * directory as foo/bar.json.
 */
router.all("/mock/:mock*", ({response, request, params}) => {
    const mockPath = params.mock;
    const preferredStatus = request.headers.get("preferred-response-type") || "200";
    const mockFile = Deno.readTextFileSync(`./mocks/${mockPath}.json`);
    const responseBody = JSON.parse(mockFile)[preferredStatus];
    response.status = parseInt(preferredStatus);

    if (responseBody) {
        response.body = JSON.parse(mockFile)[preferredStatus];
    } else {
        response.status = 501;
        response.body = { error: `Mock not found with status ${preferredStatus}` };
    }
});

const app = new Application(); 

// Sets up the application logger and logs it out to the running terminal.
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    console.log(`${ctx.response.status} – ${ctx.request.method} ${ctx.request.url} – ${rt}`);
  });

// Adds a simple timer to the response header.
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
  });

// Router
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });