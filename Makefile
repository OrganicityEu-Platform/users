default:
	@echo "No default target available"

jenkins:
	cp config/config.localhost.js config/config.js
	cp config/auth.localhost.js config/auth.js
	cp config/database.localhost.js config/database.js
	npm install
	gulp build

deploy:
	git pull
	npm install
	gulp build
	mkdir -p logs
	forever restart -o logs/out.log -e logs/err.log app.js
