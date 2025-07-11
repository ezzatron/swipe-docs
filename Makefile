CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/swipe-docs/releases/tag/
CI_VERIFY_GENERATED_FILES := true

JS_ESLINT_REQ += artifacts/content-collections.touch
JS_TSC_REQ += artifacts/content-collections.touch

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

artifacts/content-collections.touch: artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@mkdir -p $(@D)
	$(JS_EXEC) content-collections build
	@touch $@
