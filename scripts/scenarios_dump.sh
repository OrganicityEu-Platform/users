#!/bin/sh
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
mongo --quiet scenarios $DIR/scenarios_dump.js
