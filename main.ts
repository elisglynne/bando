/**
 * Main entry point to Bando.
 */
import { Application, Router, sleep, Request, helpers } from "./deps.ts";

// Const for preferred status code header/query param
const PREFERRED_STATUS = 'preferred-response-status';
const PREFERRED_DELAY = 'preferred-response-delay';

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
 * Extract the preferred status and preferred delay from the request & params.
 * The details in the header will always override anything in the query params.
 */
const extractPreferredResponse = (query: ReturnType<typeof helpers.getQuery>, request: Request) => {
    const preferredStatus = request.headers.get(PREFERRED_STATUS) || query[PREFERRED_STATUS] || "200";
    const preferredDelay = request.headers.get(PREFERRED_DELAY) || query[PREFERRED_DELAY] || "0";

    return {preferredStatus, preferredDelay};
}

/**
 * Returns the mocked response found in the mocks directory. Can be nested or can
 * be a single file with the same name as the request path. For example, if the
 * mock-er wants to mock the request to /foo/bar, it should be in the mocks
 * directory as foo/bar.json.
 */
router.all("/mock/:mockPath*", async (context) => {
    const {params, request, response} = context;
    const mockPath = params.mockPath;
    const mockFile = Deno.readTextFileSync(`./mocks/${mockPath}.json`);
    const query = helpers.getQuery(context, { mergeParams: true });
    const {preferredStatus, preferredDelay} = extractPreferredResponse(query, request);
    const responseBody = JSON.parse(mockFile)[preferredStatus];
    
    /**
     * We allow a simulated sleep delay to be set in the request header.
     */
    await sleep(parseInt(preferredDelay));
    
    if (responseBody) {
        response.status = parseInt(preferredStatus);
        response.body = JSON.parse(mockFile)[preferredStatus];
    } else {
        response.status = 501;
        response.body = { error: `Mock not found with status ${preferredStatus}` };
    }
});

const app = new Application(); 

// Sets up the application logger and logs it out to the running terminal.
app.use(async (context, next) => {
    const {response, request} = context;
    await next();
    const rt = response.headers.get("X-Response-Time");
    console.log(`${response.status} – ${request.method} ${request.url} – ${rt}`);
  });

// Adds a simple timer to the response header.
app.use(async (context, next) => {
    const { response } = context;
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    response.headers.set("X-Response-Time", `${ms}ms`);
  });

// Router
app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });