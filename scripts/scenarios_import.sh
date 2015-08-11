#!/bin/sh
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mongoimport --upsert --db scenarios --collection scenarios --stopOnError --file $DIR/scenarios_dump.json
