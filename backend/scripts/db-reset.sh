#!/bin/bash
mongosh --port 27017 examination --eval "db.getCollectionNames().forEach(function(c){ db[c].drop(); })"
mongosh --port 27017 --eval "db = db.getSiblingDB('examination'); db.createCollection('user')"
mongosh --port 27017 --eval "db = db.getSiblingDB('examination'); db.createCollection('subject')"
mongosh --port 27017 --eval "db = db.getSiblingDB('examination'); db.createCollection('semester')"
mongosh --port 27017 --eval "db = db.getSiblingDB('examination'); db.createCollection('exam')"
mongosh --port 27017 --eval "db = db.getSiblingDB('examination'); db.createCollection('score')"
mongosh --port 27017 --eval "db = db.getSiblingDB('examination'); db.createCollection('login_info')"


mongoimport --host localhost --port 27017 --db examination --collection user --type csv --headerline --file src/database/seeds/users_student.csv
mongoimport --host localhost --port 27017 --db examination --collection user --type csv --headerline --file src/database/seeds/users_teacher.csv
mongoimport --host localhost --port 27017 --db examination --collection subject --type csv --headerline --file src/database/seeds/subjects.csv
mongoimport --host localhost --port 27017 --db examination --collection semester --type csv --headerline --file src/database/seeds/semesters.csv