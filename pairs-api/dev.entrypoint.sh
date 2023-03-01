#!/bin/sh

set -eux

npm run lint \
  && npm run testCoverage \
  && npm run startDev
