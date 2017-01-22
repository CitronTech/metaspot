#!/bin/bash

webpack --config webpack.config.js
read -p "Continue? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  git add .
  git commit -m "$*"
  git push origin master
fi