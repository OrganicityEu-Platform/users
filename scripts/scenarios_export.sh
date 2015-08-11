#!/bin/sh
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mongoexport --db scenarios --collection scenarios --out $DIR/scenarios_dump.json
