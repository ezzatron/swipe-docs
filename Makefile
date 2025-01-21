CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/swipe-docs/releases/tag/
GENERATED_FILES += $(wildcard src/code/loader/*) src/code/loader/loader.js

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
build: artifacts/link-dependencies.touch
	$(JS_EXEC) next build

.PHONY: run
run: artifacts/link-dependencies.touch
	$(JS_EXEC) next dev

################################################################################

src/code/loader/%: $(wildcard src/code/loader-src/*) artifacts/link-dependencies.touch
	@rm -rf "$@"
	$(JS_EXEC) tsc -p src/code/loader-src/tsconfig.json
	@touch "$@"
