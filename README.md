# bando
a super simple mock server written with deno 

## what is it?
bando is a simple deno server that returns a JSON response based on the route provided. Mocks are placed as json files, like `example.json` in the `mocks` directory, and then can be accessed by making requests to the `http://localhost:5400/mock/test` URL. The JSON files should be structured like:

```
  200: {
    example: body
  },
  400: {
    example: fail
  }
```
The keys in the example above being the statuses that could be returned. The default response will be `200`, but this can be overriden by providing `preferred-response-status` in the request header.  You can also include a delay to your response by adding `prefferred-response-delay` in the header and provide a value as seconds. If you're unable to provide these values in the header, you can supply them in the query string, for example: `http://127.0.0.1:5400/mock/test?preferred-response-delay=2&preferred-response-status=400`.

## including faker 
bando currently has very basic support for [faker](https://fakerjs.dev/) and can be used by including `faker` in the request header. This will then be used to generate a random response based on the mock file provided. For example, if you have a mock file like:

```
  200: {
    example: 'boris mcBoringName'
  },
  400: {
    example: fail
  }
```

this will always return the same name (boris mcBoringName). but if you want some variety, you change the response to be

```
  200: {
    example: "_firstName_"
  },
  400: {
    example: fail
  }
```
this will use the faker library to generate a random name for you. You can also use the faker library to generate random numbers, dates, etc. You can find more information on the faker library [here](https://fakerjs.dev/).

## how to run?
If you have docker installed, you can get bando up and running by using the `make` command. If you don't want to use docker, just install deno and run `deno run --allow-net --allow-read --watch main.ts`, you can then visit the relevant mock response at `http://localhost:8000/mock/*`
