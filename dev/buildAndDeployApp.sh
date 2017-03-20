#!/bin/bash

npm run build
read -p "Continue? " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
  git add .
  git commit -m "$*"
  git push origin master
fi