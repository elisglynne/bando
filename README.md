# bando
A super simple mock server written with deno 

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
The keys in the example above being the statuses that could be returned. The default response will be `200`, but this can be overriden by providing `preferred-response-type` in the request header. 

## how to run?
If you have docker installed, you can get bando up and running by using the `make` command. 
