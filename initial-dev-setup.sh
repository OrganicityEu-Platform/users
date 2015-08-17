#!/bin/sh
DIR=`dirname "${BASH_SOURCE[0]}"`
cd $DIR/.git/hooks/
ln -f -s ../../pre-commit.sh pre-commit 
