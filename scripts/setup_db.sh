#!/bin/sh
mongo --eval 'db.scenarios.ensureIndex({narrative:"text"},{title:"text"},{summary:"text"});'
