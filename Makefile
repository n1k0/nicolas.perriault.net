SHELL := /bin/bash

install:
	rbenv install 2.7.7
	rbenv local 2.7.7
	bundle
	npm install

build:
	bundle exec jekyll build

clean:
	bundle exec jekyll clean

optim:
	find static -name "*.jpg" | xargs jpegoptim
	find static -name "*.png" | xargs optipng

serve:
	bundle exec jekyll browsersync
