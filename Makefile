default:
	@echo "No default target available"

jenkins:
	cp config/config.localhost.js config/config.js
	cp config/auth.localhost.js config/auth.js
	cp config/database.localhost.js config/database.js
	npm install
	gulp build

