.PHONY: build-HelloWorldFunction

build-HelloWorldFunction:
	DENO_DIR=.deno_dir deno cache hello.ts
	cp -R ".deno_dir/gen/file/$(PWD)/" .deno_dir/LAMBDA_TASK_ROOT
	cp -a . "$(ARTIFACTS_DIR)"