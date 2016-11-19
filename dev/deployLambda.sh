#!/bin/bash

#if [ "$#" = 2 ] && [ "$2" = "--create" ]; then
#fi

cd $1
rm lambda.zip
rm -r src/node_modules/dynamo
cp -r ../../modules/dynamo src/node_modules
rm -r src/node_modules/metaspot
cp -r ../../modules/metaspot src/node_modules
rm -r src/node_modules/utils
cp -r ../../modules/utils src/node_modules
rm -r src/node_modules/crawler
cp -r ../../modules/crawler src/node_modules
cd src
zip -r ../lambda.zip ./*
cd ..
node ./deploy.js $2