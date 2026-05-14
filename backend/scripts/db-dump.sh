#!/bin/bash

DB_NAME="examination"
PORT="27017"
OUT_DIR="src/database/seeds"

mkdir -p "$OUT_DIR"

collections=$(mongosh --quiet --port $PORT $DB_NAME --eval "db.getCollectionNames().join(' ')")

for collection in $collections
do
  echo "Exporting $collection ..."

  mongoexport \
    --port=$PORT \
    --db=$DB_NAME \
    --collection=$collection \
    --type=csv \
    --fields="$(mongosh --quiet --port $PORT $DB_NAME --eval "
      var doc = db.getCollection('$collection').findOne();
      if(doc){
        print(Object.keys(doc).join(','))
      }
    ")" \
    --out="$OUT_DIR/${collection}.csv"
done

echo "Done!"