CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/swipe-docs/releases/tag/

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-npm.mk
-include .makefiles/pkg/js/v1/with-tsc.mk
-include .makefiles/pkg/js/v1/with-next.mk
-include .makefiles/pkg/changelog/v1/Makefile

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

.PHONY: build
build: artifacts/code-loader artifacts/link-dependencies.touch
	$(JS_EXEC) next build

.PHONY: run
run: artifacts/code-loader artifacts/link-dependencies.touch
	$(JS_EXEC) next dev

################################################################################

artifacts/code-loader: $(wildcard src/code/loader/*) artifacts/link-dependencies.touch
	@rm -rf "$@"
	$(JS_EXEC) tsc -p src/code/loader/tsconfig.json
	@touch "$@"
