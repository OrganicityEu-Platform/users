server:
	node server

admin:
	node mkAdminUser

dropDatabase:
	mongo scenarios --eval "db.dropDatabase();"
