#!/bin/sh
npm run build
cp web.config ../eff5front/web.config
cd build
cp -Ra . ../../eff5front
cd ../../eff5front
git status
git add .