server:
	node server

admin:
	node scripts/mkAdminUser

dropDatabase:
	mongo scenarios --eval "db.dropDatabase();"
