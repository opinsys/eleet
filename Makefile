
prefix ?= /usr/local
exec_prefix = $(prefix)
bindir = $(exec_prefix)/bin
datarootdir = $(prefix)/share
INSTALL = install
INSTALL_PROGRAM = $(INSTALL)
INSTALL_DATA = $(INSTALL) -m 644

export PATH := node_modules/.bin:$(PATH)

# node-webkit version
NW_VERSION=0.6.3

# https://github.com/rogerwang/nw-gyp
NW_GYP=$(CURDIR)/node_modules/.bin/nw-gyp

define nw-build
	@echo "Building node.js module '$1' for node-webkit"
	cd node_modules/$1/ && $(NW_GYP) configure --target=$(NW_VERSION) && $(NW_GYP) build
endef


build: npm-install nw-gyp

npm-install:
	npm install

nw-gyp:
	$(call nw-build,leapjs/node_modules/ws)

install-dirs:
	mkdir -p $(DESTDIR)$(bindir)
	mkdir -p $(DESTDIR)$(datarootdir)/applications
	mkdir -p $(DESTDIR)/usr/share/icons
	mkdir -p $(DESTDIR)/opt/eleet

install: install-dirs
	cp -r lib node_modules bin assets *.js *.json *.md *.html $(DESTDIR)/opt/eleet
	$(INSTALL_DATA) -t $(DESTDIR)$(datarootdir)/applications eleet.desktop
	$(INSTALL_DATA) -t $(DESTDIR)/usr/share/pixmaps assets/eleet.png
	$(INSTALL_PROGRAM) -t $(DESTDIR)$(bindir) bin/eleet

clean:
	rm -rf node_modules
	rm -rf *.bin
