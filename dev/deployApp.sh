#!/bin/bash

webpack --config webpack.config.js
read -p "Continue? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  git add .
  git commit -m "$1"
  git push origin master
fi