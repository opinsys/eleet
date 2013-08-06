


export PATH := node_modules/.bin:$(PATH)

# node-webkit version
NW_VERSION=0.6.3

# https://github.com/rogerwang/nw-gyp
NW_GYP=$(CURDIR)/node_modules/.bin/nw-gyp

define nw-build
	@echo "Building node.js module '$1' for node-webkit"
	cd node_modules/$1/ && $(NW_GYP) configure --target=$(NW_VERSION) && $(NW_GYP) build
endef


nw-gyp:
	$(call nw-build,leapjs/node_modules/ws)
