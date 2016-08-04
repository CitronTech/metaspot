#!/bin/bash

#if [ "$#" = 2 ] && [ "$2" = "--create" ]; then
#fi

cd $1
rm lambda.zip
cd src
zip -r ../lambda.zip ./*
cd ..
node ./deploy.js $2