#!/bin/sh
git stash -q --keep-index
gulp lint
git stash pop -q
