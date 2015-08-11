#!/bin/sh
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
source $DIR/scenarios_import.sh 
mongo scenarios $DIR/setup_db.js
