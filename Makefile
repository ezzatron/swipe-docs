CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/swipe-docs/releases/tag/
CI_VERIFY_GENERATED_FILES := true

CODE_LOADER_TS_FILES := $(wildcard src/code/loader-src/*.ts)

CODE_LOADER_DIST_FILES += $(patsubst src/code/loader-src/%.ts,src/code/loader/%.js,$(CODE_LOADER_TS_FILES))
CODE_LOADER_DIST_FILES += $(patsubst src/code/loader-src/%.ts,src/code/loader/%.js.map,$(CODE_LOADER_TS_FILES))
CODE_LOADER_DIST_FILES += $(patsubst src/code/loader-src/%.ts,src/code/loader/%.d.ts,$(CODE_LOADER_TS_FILES))

GENERATED_FILES += $(CODE_LOADER_DIST_FILES)

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
build: $(GENERATED_FILES) artifacts/link-dependencies.touch
	$(JS_EXEC) next build

.PHONY: run
run: $(GENERATED_FILES) artifacts/link-dependencies.touch
	$(JS_EXEC) next dev

# Verify generated files on precommit
.PHONY: precommit
precommit:: verify-generated

################################################################################

$(CODE_LOADER_DIST_FILES): src/code/loader-src/tsconfig.json $(CODE_LOADER_TS_FILES) artifacts/link-dependencies.touch
	@rm -rf "$(@D)"
	$(JS_EXEC) tsc -p "$<"
