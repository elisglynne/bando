go:
	docker build -t app . && docker run --name deno_mock --rm -it --init -p 5400:8000 app