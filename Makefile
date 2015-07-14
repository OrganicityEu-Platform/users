server:
	node server

admin:
	node standalone/mkAdminUser

dropDatabase:
	mongo scenarios --eval "db.dropDatabase();"
